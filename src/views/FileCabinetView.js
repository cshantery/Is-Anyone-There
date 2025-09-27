class FileCabinet {
    constructor(id, x, y, scale, img,  onClick = () => {}) {
        this.id = id;
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
        this.background = SM.get("WestWall");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);
        this.secretId = 2; // index of cabinet that will be unlocked

        this.scale = 0.4
        this.allFileCabinets = [];
        for(let i = 0; i < 4; i++){
            this.allFileCabinets.push(new FileCabinet(i, 1+4*i, 5.5, this.scale, `FileCabinet${i+1}`, (obj) => {
                console.log(`File Cabinet ${i} Clicked`)

                if(obj.id == this.secretId){
                    console.log('this is the secret cabinet.')
                }else{
                    this.textNotificationHandler.addText('This file cabinet appears to be locked...')
                    console.log('this is a locked cabinet.')
                }
            }));
        }
    }

    update(dt){
        this.textNotificationHandler.update(dt)
    }

    draw() {

    }

    onEnter() {
        // add objects to renderer
        R.add(this.background);
        for(let i = 0; i < 4; i++){
            R.add(this.allFileCabinets[i])
        }
        // call onenters
        for(let i = 0; i < 4; i++){
            this.allFileCabinets[i].onEnter()
        }
    }
    onExit() {
        R.remove(this.background);
        for(let i = 0; i < 4; i++){
            R.remove(this.allFileCabinets[i])
        }
        for(let i = 0; i < 4; i++){
            this.allFileCabinets[i].onExit()
        }

        this.textNotificationHandler.cleanup()
    }
}