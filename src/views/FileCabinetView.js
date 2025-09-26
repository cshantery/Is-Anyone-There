class FileCabinet {
    constructor(x, y, scale, img,  onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.scale = scale;

        this.background = SM.get(img);
        this.background.setPos(this.x, this.y);
        this.background.setScale(this.scale);
        this.width = 1.85
        this.height = 3

        this.onClick = onClick;
        this.highlight = new HighlightEvent(this.x, this.y, this.width, this.height);
    }

    isMouseInBounds(mx, my) {
        const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();

        return (
            m.x >= this.x &&
            m.x <= this.x + this.width &&
            m.y >= this.y &&
            m.y <= this.y + this.height
        );
    }

    onEnter() {
        R.add(this.background, 99)
        R.add(this.highlight);
    }
    onExit() {
        R.remove(this.background);
        R.remove (this.highlight);
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClick(this);
        }
    }
}

class FileCabinetView extends View {
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("SouthWall");
        this.background.setSize(16, 9);
    
        this.scale = 0.4
        this.fc1 = new FileCabinet(1, 5.5, this.scale, "FileCabinet1", () => {console.log("File1 Clicked")});
        this.fc2 = new FileCabinet(5, 5.5, this.scale, "FileCabinet2", () => {console.log("File2 Clicked")});
        this.fc3 = new FileCabinet(9, 5.5, this.scale, "FileCabinet3", () => {console.log("File3 Clicked")});
        this.fc4 = new FileCabinet(13, 5.5, this.scale, "FileCabinet4", () => {console.log("File4 Clicked")});
    }

    draw() {

    }

    onEnter() {
        R.add(this.background);
        R.add(this.fc1);
        R.add(this.fc2);
        R.add(this.fc3);
        R.add(this.fc4);
        this.fc1.onEnter();
        this.fc2.onEnter();
        this.fc3.onEnter();
        this.fc4.onEnter();
    }
    onExit() {
        R.remove(this.background);
        R.remove(this.fc1);
        R.remove(this.fc2);
        R.remove(this.fc3);
        R.remove(this.fc4);
        this.fc1.onExit();
        this.fc2.onExit();
        this.fc3.onExit();
        this.fc4.onExit();
    }
}