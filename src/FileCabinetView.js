class FileCabinetObject {
  // x, y, w, h are in 16:9 units (x/w along 16, y/h along 9)
  constructor(id, x, y, w, h, imagePath, onClick = () => {}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;    // width in 16-units
    this.h = h;    // height in 9-units
    this.onClick = onClick;

    this.cabinetSprite = new Sprite2D(imagePath, x, y, {
      width:  w,
      height: h
    });
  }

  isMouseInBounds(mx, my) {
    return (
      mx >= this.x && mx <= this.x + this.w &&
      my >= this.y && my <= this.y + this.h
    );
  }

  update(dt) {}

  draw() {
    this.cabinetSprite.draw();
  }

  mousePressed(p) {
    const m = p || VM.mouse();
    if (this.isMouseInBounds(m.x, m.y)) this.onClick(this);
  }
}

class OpenCabinetUIObject {
  constructor(x, y, w, h, uiText, uiName, onClick = () => {}) {
    // Panel rect in 16:9 units
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.uiText = uiText;     // not used in drawing right now, but kept
    this.uiName = uiName;
    this.onClick = onClick;

    this.baseColor  = color(122, 128, 134);
    this.hoverColor = color(122, 128, 134);

    // Layout params proportional to UI size
    this.padU       = 0.6;                    // padding in X units
    this.cornerU    = 0.6;                    // corner radius in X units
    this.titleSizeV = Math.min(0.9, this.h * 0.12); // title text size (in V-units)
    this.closeSizeV = Math.min(1.2, this.h * 0.16); // close 'X' size (in V-units)

    // Secret image size relative to panel
    this.secretW = this.w * 0.35; // X units
    this.secretH = this.h * 0.50; // Y units

    this.secretSprite = new Sprite2D(
      'assets/object/secondNumber.png',
      0, 0, // position set each draw (centered)
      { width: this.secretW, height: this.secretH }
    );
  }

  isMouseInBounds(mx, my) {
    return (
      mx >= this.x && mx <= this.x + this.w &&
      my >= this.y && my <= this.y + this.h
    );
  }

  update(dt) {}

  draw() {
    const u = VM.u(), v = VM.v();
    const m = VM.mouse();
    const hover = this.isMouseInBounds(m.x, m.y);

    // Panel
    noStroke();
    fill(hover ? this.hoverColor : this.baseColor);
    rect(this.x * u, this.y * v, this.w * u, this.h * v, this.cornerU * u);

    // Title (top-left)
    fill(0);
    textAlign(LEFT, TOP);
    textSize(this.titleSizeV * v);
    text(this.uiName, (this.x + this.padU) * u, (this.y + this.padU) * v);

    // Close “X” (top-right)
    textAlign(RIGHT, TOP);
    textSize(this.closeSizeV * v);
    text('X', (this.x + this.w - this.padU) * u, (this.y + this.padU * 0.6) * v);

    // Center secret sprite inside panel
    this.secretSprite.x = this.x + (this.w - this.secretW) / 2;
    this.secretSprite.y = this.y + (this.h - this.secretH) / 2;
    this.secretSprite.draw();
  }

  mousePressed(p) {
    const m = p || VM.mouse();
    if (this.isMouseInBounds(m.x, m.y)) this.onClick(this);
  }
}

class FileCabinetView extends View {
  constructor(backgroundImg, fcImg, cabinetCount = 4) {
    super(172, 170, 172, '');

    this.backgroundImg = backgroundImg;
    this.fcImg = fcImg;

    this.fadeoutRate = 0.03;   // smaller = slower fade
    this.lockedVisibility = 0; // 0..1
    this.holdFadeout = false;
    this.timer = 0;

    const u = VM.u(), v = VM.v();
    const cabW = 150 / u;   // ~1.25 units at 1920x1080
    const cabH = 300 / v;   // ~2.50 units at 1920x1080

    const coordinatesPx = [
      [300, 430],
      [600, 470],
      [900, 430],
      [1200, 440]
    ];

    this.cabinets = [];
    const chosenCabinet = 2; // index of the “secret” cabinet (0-based)

    for (let i = 0; i < Math.min(cabinetCount, coordinatesPx.length); i++) {
      const [px, py] = coordinatesPx[i];
      const x = px / u;      // to units
      const y = py / v;      // to units

      this.cabinets.push(
        new FileCabinetObject(
          i,
          x, y, cabW, cabH,
          'assets/testObjects/filecabinet.png',
          (obj) => {
            if (obj.id === chosenCabinet) {
              // Open popup UI
              R.add(this.uiObject, 100);
            } else {
              // Show "locked" message with fade
              this.lockedVisibility = 1;
              this.holdFadeout = true;
            }
          }
        )
      );
    }

    const kUI = 0.70;              // <— adjust this to shrink/enlarge the popup
    const uiW = 8.0 * kUI;         // units along 16
    const uiH = 5.0 * kUI;         // units along 9
    const uiX = 8.0 - uiW / 2;     // centered
    const uiY = 4.5 - uiH / 2;

    this.uiObject = new OpenCabinetUIObject(
      uiX, uiY, uiW, uiH,
      "8",                       // your secretNumber (kept literal here)
      'Mysterious Filing Cabinet',
      () => { R.remove(this.uiObject); }
    );
  }

  draw() {
    super.draw();

    // Stretch background to fill the canvas
    if (this.backgroundImg) {
      image(this.backgroundImg, 0, 0, width, height);
    }

    // Locked message fade
    if (!this.holdFadeout) {
      this.lockedVisibility = this.lockedVisibility * (1 - this.fadeoutRate);
      if (this.lockedVisibility < 0.1) this.lockedVisibility = 0;
    }

    if (this.lockedVisibility > 0) {
      const u = VM.u(), v = VM.v();
      fill(0, 0, 0, 255 * this.lockedVisibility);
      noStroke();
      textAlign(LEFT, TOP);
      textSize(0.55 * v);
      text("This file cabinet is locked...", (0.8) * u, (0.8) * v);
    }
  }

  update(dt) {
    if (this.holdFadeout) {
      this.timer += dt;
      if (this.timer > 1) {
        this.holdFadeout = false;
        this.timer = 0;
      }
    }
  }

  keyPressed() {}

  mousePressed(p) {
    // You can log unit mouse here if you want
    // const m = p || VM.mouse();
    // console.log('cabinet view mouse', m.x, m.y);
  }

  onEnter() {
    for (const c of this.cabinets) R.add(c);
  }

  onExit() {
    for (const c of this.cabinets) R.remove(c);
    R.remove(this.uiObject, 100);
  }
}
