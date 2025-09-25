class Terminal {
  constructor(onExit = () => {}) {
    this.onExit = onExit;
    this.input = "";
    this.history = [];
    this.maxLines = 8;    // how many lines to show in the modal

    this._closeBtn = new Button(13.3, 1.1, 0.6, (self) => {
      R.selfRemove(self);
      R.remove(this);
      onExit();
    });
    R.add(this._closeBtn, 11);
  }

  draw() {
    const u = VM.u(), v = VM.v();

    push();
    fill(0);
    stroke(255);
    strokeWeight(2);
    rect(2 * u, 1 * v, 12 * u, 7 * v, 10);

    noStroke();
    fill(30);
    rect(2 * u, 1 * v, 12 * u, 0.8 * v, 10);
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(0.45 * v);
    text("Terminal", (2.3) * u, (1.4) * v);

    const left = 2.3 * u;
    const top = (1.9) * v;
    const lh = 0.6 * v;

    const start = Math.max(0, this.history.length - this.maxLines);
    let y = top;
    textAlign(LEFT, TOP);
    textSize(0.5 * v);
    fill(230);

    for (let i = start; i < this.history.length; i++) {
      text("> " + this.history[i], left, y);
      y += lh;
    }

    // Blinking Cursor
    const cursor = frameCount % 60 < 30 ? "_" : " ";
    text("> " + this.input + cursor, left, y);

    pop();
  }

  update(dt) {}

  keyPressed() {
    // Submit
    if (keyCode === ENTER || keyCode === RETURN) {
      this.history.push(this.input);
      // keep history bounded
      if (this.history.length > 200) this.history.shift();
      this.input = "";
      return;
    }

    // Backspace
    if (keyCode === BACKSPACE) {
      this.input = this.input.slice(0, -1);
      return;
    }

    // Accept only ASCII
    if (typeof key === "string" && /^[\x20-\x7E]$/.test(key)) {
      this.input += key;
    }
  }

  // Clean up if you ever remove it externally
  onRemove() {
    R.remove(this._closeBtn);
  }
}


class PinButton extends Button {
    constructor(x, y, size, val, onClick = () => {}) {
        super(x, y, size, onClick);
        this.x = x;
        this.y = y;
        this.size = size;
        this.val = val;
    }

    draw() {
        super.draw();
        const u = VM.u();
        const v = VM.v();
        
        push();
        noStroke();
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(this.size * 0.6 * v);
        const cx = (this.x + this.size / 2) * u;
        const cy = (this.y + this.size / 2) * v;
        text(String(this.val), cx, cy);
        pop();
    }
}

class Pinpad {
    constructor( onExit = () => {}) {
        this.code = [];
        this.onExit = onExit;
        this.label = "";
        this.pass = '765'
        
        R.add(new Button(10, 1.4, 0.6, (self) => {
            R.selfRemove(self)
            R.remove(this);
            onExit();
            this.pinButtons.forEach((obj) => {
                R.remove(obj);
            })
        }));

this.pinButtons = [];

        // digits 1–9
        for (let i = 0; i < 9; ++i) {
            const col = i % 3;                 // 0,1,2
            const row = Math.floor(i / 3);     // 0,1,2
            const val = i + 1;

            const btn = new PinButton(
                6.3 + col * 1.25, 
                3.6 + row, 
                0.9, 
                val,
                () => {
                    this.label += val;
                    if (this.label.length === 3) {
                        console.log(this.label === this.pass ? "Correct Pin!" : "Incorrect Pin!");
                        this.label = '';
                    }
                }
            );

            this.pinButtons.push(btn);
            R.add(btn, 10);
        }

        // digit 0
        const zeroBtn = new PinButton(
            6.3 + 1 * 1.25,    
            3.6 + 3,           
            0.9,
            0,
            () => {
                this.label += '0';
                if (this.label.length === 3) {
                    console.log(this.label === this.pass ? "Correct Pin!" : "Incorrect Pin!");
                    this.label = '';
                }
            }
        );

        this.pinButtons.push(zeroBtn);
        R.add(zeroBtn, 10);


    }

    draw() {
        const u = VM.u();
        const v = VM.v();

        push();
        fill(255, 255, 255);
        rect(6 * u, 2 * v, 4 * u, 6 * v, 8);
        fill(0, 0, 0);
        rect(6.2 * u, 2.2 * v, 3.6 * u, 1.2 * v, 8);
        
        fill(255, 255, 255);
        textAlign(LEFT);
        textSize(1 * v);
        text(this.label, 6.3 * u, 2.8 * v);

        pop();
    }

    update(dt) {

    }

    keyPressed() {
        if (keyCode === BACKSPACE) {
            this.label = this.label.slice(0, -1);
        } else if (this.label.length < 3 && /^[0-9]$/.test(key)) {
            this.label += key;
            if (this.label.length === 3) {
                console.log(this.label === this.pass ? "Correct Pin!" : "Incorrect Pin!");

                this.label = '';
            }
        }
    }

}

class ComputerView extends View {
    constructor() {
        super();
        
        this.background = SM.get("NorthWall");
        // Fills the screen
        this.background.setSize(16, 9);
    
        this.pinpad = SM.get("pinpad");
        this.pinpad.setScale(0.5);
        this.pinpad.setPos(12.5, 6);

        this.terminalHighlight = new HighlightEvent(
            2.33, 0.25, 6.6, 10.1, 255, 255, 0,
            (self) => {
                R.selfRemove(self);
                R.remove(this.pinpadHighlight);
                R.add(new Terminal(() => {
                    // re-enable highlights when terminal closes
                    R.add(this.terminalHighlight);
                    R.add(this.pinpadHighlight);
                }));
            }
        );


        this.pinpadHighlight = new HighlightEvent(12.5, 6, 1.45, 1.3, 255, 255, 0, (self) => {
            console.log("Pinpad");
            R.selfRemove(self);
            R.remove(this.terminalHighlight);

            R.add(new Pinpad(() => {
                R.add(this.terminalHighlight);
                R.add(this.pinpadHighlight);
            }));
            
        });
    }

    onEnter() {
        R.add(this.background);
        R.add(this.pinpad);
        R.add(this.terminalHighlight);
        R.add(this.pinpadHighlight);
    }

    onExit() {
        R.remove(this.background);
        R.remove(this.pinpad);
        R.remove(this.terminalHighlight)
        R.remove(this.pinpadHighlight);
    }
}