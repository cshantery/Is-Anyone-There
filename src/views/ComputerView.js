class NumButton extends ConditionalButton {
  constructor(x, y, size, label, onClick, canDraw, c1, c2, c3, makeInvisible) {
    super(x, y, size, onClick, canDraw, c1, c2, c3, makeInvisible);
    this.label = label;
  }
  draw() {
    super.draw();
    if (this.CanDraw_ && !this.makeInvis_) {
      const u = VM.u(), v = VM.v();
      const cx = (this.x + this.size / 2) * u;
      const cy = (this.y + this.size / 2) * v;
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      // size proportional to button height
      textSize(this.size * 0.75 * v);
      text(this.label, Math.round(cx), Math.round(cy));
    }
  }
}

class ComputerView extends View {
  constructor() {
    super(58, 134, 255, '');

    this.ComputerIsOpen_ = false;
    this.PinIsOpen_ = false;

    this.pinpadimg_     = loadImage('assets/testObjects/pinpad.png');
    this.backgroundimg_ = loadImage('assets/testObjects/NorthWall.png');

    this.kTerm = 0.9;
    this.kPin  = 0.72;

    this.ScreenW_ = 14.0 * this.kTerm;
    this.ScreenH_ =  7.0 * this.kTerm;
    this.ScreenX_ = 8.0 - this.ScreenW_ / 2;
    this.ScreenY_ = 4.5 - this.ScreenH_ / 2;

    this.PinW_ = 8.0 * this.kPin;
    this.PinH_ = 6.0 * this.kPin;
    this.PinX_ = 8.0 - this.PinW_ / 2;
    this.PinY_ = 4.5 - this.PinH_ / 2;

    // keypad hotspot moved to the side (right wall)
    this.padX_ = 14.2;
    this.padY_ = 4.6;
    this.padS_ = 0.85 * this.kTerm;

    this.bttn = new ConditionalButton(2.0, 1.0, 1.5 * this.kTerm, () => this.openComputer(), true, 128,128,128, true);
    this.closebttn = new ConditionalButton(
      this.ScreenX_ + this.ScreenW_ - 0.6 * this.kTerm,
      this.ScreenY_ - 0.6 * this.kTerm,
      0.5 * this.kTerm,
      () => this.closeComputer(), false, 200,35,35, false
    );

    this.pinbttn = new ConditionalButton(this.padX_, this.padY_, this.padS_, () => this.openPin(), true, 255,255,255, true);
    this.closepinbttn = new ConditionalButton(
      this.PinX_ + this.PinW_ - 0.7 * this.kPin,
      this.PinY_ - 0.7 * this.kPin,
      0.6 * this.kPin,
      () => this.closePin(), false, 200,35,35, false
    );

    this.PinAttempt_ = '';
    this.PinString_  = 'Enter Pin: ';
    this.PinCount_   = 0;
    this.Password_   = '393';
    this.PinMessage_ = '';

    const cell   = 1.05 * this.kPin;
    const size   = 0.9  * this.kPin;
    const startX = this.PinX_ + 1.2 * this.kPin;
    const startY = this.PinY_ + 1.8 * this.kPin;

    this.pinButtons = [];
    const mk = (nx, ny, label) => {
      const b = new NumButton(
        startX + nx * cell, startY + ny * cell, size,
        label, () => this.PinPress(label),
        false, 200,200,200, false
      );
      this.pinButtons.push(b);
      return b;
    };
    this.pinbttn1 = mk(0,0,'1');
    this.pinbttn2 = mk(1,0,'2');
    this.pinbttn3 = mk(2,0,'3');
    this.pinbttn4 = mk(0,1,'4');
    this.pinbttn5 = mk(1,1,'5');
    this.pinbttn6 = mk(2,1,'6');
    this.pinbttn7 = mk(0,2,'7');
    this.pinbttn8 = mk(1,2,'8');
    this.pinbttn9 = mk(2,2,'9');

    this.givenCommand_ = '';
    this.EnterPressed_ = false;
  }

  draw() {
    super.draw();
    image(this.backgroundimg_, 0, 0, width, height);

    const u = VM.u(), v = VM.v();

    push();

    if (this.ComputerIsOpen_) {
      this.PinIsOpen_ = false;

      stroke(100);
      strokeWeight(0.12 * u * this.kTerm);
      fill(0);
      rect(this.ScreenX_*u, this.ScreenY_*v, this.ScreenW_*u, this.ScreenH_*v);

      const left = this.ScreenX_ + 0.6 * this.kTerm;
      const top  = this.ScreenY_ + 0.8 * this.kTerm;

      noStroke();
      fill(255);
      textSize(1.0 * v * this.kTerm);
      text('> Type Command for Computer...ENTER to execute', left*u, top*v);
      text('> ' + this.givenCommand_, left*u, (top + 1.0*this.kTerm)*v);

      if (this.EnterPressed_) {
        text('> Command : ' + this.givenCommand_ + ' : EXECUTED', left*u, (top + 2.0*this.kTerm)*v);
        text('> Closing Terminal...', left*u, (top + 2.8*this.kTerm)*v);
        setTimeout(() => this.closeComputer(), 2000);
      }

      this.closebttn.CanDraw();
      this.bttn.NotDraw();
      this.pinbttn.NotDraw();
    }

    if (!this.ComputerIsOpen_ && !this.PinIsOpen_) {
      image(this.pinpadimg_, this.padX_*u, this.padY_*v, this.padS_*u, this.padS_*v);

      this.bttn.CanDraw();
      this.closebttn.NotDraw();
      this.pinbttn.CanDraw();
      this.closepinbttn.NotDraw();

      for (const b of this.pinButtons) b.NotDraw();
    }

    if (this.PinIsOpen_) {
      this.ComputerIsOpen_ = false;

      fill(255);
      stroke(0);
      strokeWeight(0.18 * u * this.kPin);
      rect(this.PinX_*u, this.PinY_*v, this.PinW_*u, this.PinH_*v, 0.7*u*this.kPin);

      noStroke();
      fill(0);
      rect((this.PinX_ + 0.6*this.kPin)*u, (this.PinY_ + 1.0*this.kPin)*v,
           (this.PinW_ - 1.1*this.kPin)*u, (this.PinH_ / 6)*v);

      fill('black');
      textSize(0.75 * v * this.kPin);
      text(this.PinMessage_, (this.PinX_ + 0.9*this.kPin)*u, (this.PinY_ + 0.85*this.kPin)*v);

      fill('limegreen');
      textSize(1.0 * v * this.kPin);
      text(this.PinString_ + this.PinAttempt_, (this.PinX_ + 0.7*this.kPin)*u, (this.PinY_ + 2.0*this.kPin)*v);

      this.closepinbttn.CanDraw();
      this.bttn.NotDraw();
      this.pinbttn.NotDraw();

      for (const b of this.pinButtons) b.CanDraw();
    }

    pop();
  }

  openComputer() { this.ComputerIsOpen_ = true; }
  closeComputer() {
    this.ComputerIsOpen_ = false;
    this.givenCommand_ = '';
    this.EnterPressed_ = false;
  }

  openPin() { this.PinIsOpen_ = true; }
  closePin() {
    this.PinIsOpen_ = false;
    this.PinMessage_ = '';
    this.PinAttempt_ = '';
    this.PinCount_ = 0;
  }

  PinPress(key) {
    this.PinAttempt_ += key;
    this.PinCount_++;
    if (this.PinCount_ === 3) {
      if (this.PinAttempt_ === this.Password_) {
        this.PinMessage_ = 'Correct Pin Entered!';
        this.PinCount_ = 0;
        this.PinAttempt_ = '';
        setTimeout(() => this.closePin(), 1500);
      } else {
        this.PinMessage_ = 'Incorrect Pin, Try Again';
        this.PinCount_ = 0;
        this.PinAttempt_ = '';
      }
    }
  }

  keyPressed() {
    if (keyCode === ENTER && this.givenCommand_ !== '') {
      this.EnterPressed_ = true;
    } else if (keyCode === BACKSPACE) {
      this.givenCommand_ = this.givenCommand_.slice(0, -1);
    } else {
      this.givenCommand_ += key;
    }
  }

  onEnter() {
    R.add(this.bttn);
    R.add(this.closebttn);
    R.add(this.pinbttn);
    R.add(this.closepinbttn);
    for (const b of this.pinButtons) R.add(b);
  }

  onExit() {
    R.remove(this.bttn);
    R.remove(this.closebttn);
    R.remove(this.pinbttn);
    R.remove(this.closepinbttn);
    for (const b of this.pinButtons) R.remove(b);
  }

  mousePressed(p) {
    if (!this.ComputerIsOpen_ && !this.PinIsOpen_) {
      const m = p || VM.mouse();
      const inside = (
        m.x >= this.ScreenX_ &&
        m.x <= this.ScreenX_ + this.ScreenW_ &&
        m.y >= this.ScreenY_ &&
        m.y <= this.ScreenY_ + this.ScreenH_
      );
      if (inside) this.openComputer();
    }
  }
}