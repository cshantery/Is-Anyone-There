const breakerBoxWidth = 1;
const breakerBoxHeight = 2; 

const breakerClickWidth = 1; 
const breakerClickHeight = 2;
class BreakerBox{
    constructor(x, y, onTransition = null) {
        this.x = x;
        this.y = y;
        this.onTransition = onTransition;
        this.highlight = new HighlightEvent(this.x, this.y, breakerBoxWidth, breakerBoxHeight);
}

    mousePressed(p) {
        // kind of combined isMouseInBounds with mousePressed
        const m = p || VM.mouse();
        if (m.x >= this.x  && m.x <= this.x + breakerClickWidth &&
            m.y >= this.y  && m.y <= this.y + breakerClickHeight) {
                if (typeof this.onTransition === 'function') {
                    this.onTransition();
                } 
        }
    }

    update(dt){}

    draw() {
    // You can draw a placeholder rectangle for the breaker box
    const u = VM.u();
    const v = VM.v();
    fill(300);
    stroke(220);
    strokeWeight(4);
    rect(this.x * u, this.y * v, breakerBoxWidth * u, breakerBoxHeight * v);
  }

    onEnter() {
        R.add(this);
        R.add(this.highlight);
    }

    onExit() {
        R.remove(this);
        R.remove(this.highlight);
  }
}



class BreakerBoxView extends View{
    constructor(breakerBoxes = [], backgroundAsset = null) {
        super();

        this.background = backgroundAsset ?? SM.get("placeholderWall");
        this.background.setSize(16, 9);

        // Create a new BreakerBox object for each configuration passed in
        this.boxes = breakerBoxes.map(config => new BreakerBox(
            config.x,
            config.y,
            config.onTransition ?? null
        ));
    }

    update(dt) {
        this.boxes.forEach(box => box.update(dt));
    }

    draw() {
        this.background.draw();
        this.boxes.forEach(box => box.draw());
    }

    onEnter() {
        R.add(this);
        this.boxes.forEach(box => box.onEnter());
    }

    onExit() {
        R.remove(this);
        this.boxes.forEach(box => box.onExit());
    }

    mousePressed(p) {
        console.log("BreakerBoxView received a click!");
        this.boxes.forEach(box => box.mousePressed(p));
    }
}