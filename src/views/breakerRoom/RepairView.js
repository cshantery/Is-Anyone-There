class RepairToolCabinet{
    constructor(x, y, scale, onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.scale = scale;

        this.closedSprite = SM.get("closedRepair");
        this.closedSprite.setPos(this.x, this.y);
        this.closedSprite.setScale(this.scale);
        this.width = 1.93
        this.height = 2.3

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
        R.add(this.closedSprite, 9)
    }
    onExit() {
        R.remove(this.closedSprite);
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClick(this);
        }
    }
}

class RepairView extends View {
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);

        this.repairCabinet = new RepairToolCabinet(1, 1, 0.4)

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85);
    }

    update(dt){
        // pass time to fading logic for text notifications
        this.textNotificationHandler.update(dt)
    }

    draw() {

    }

    onEnter() {
        R.add(this.background);
        R.add(this.repairCabinet)

        // call on enters
        this.repairCabinet.onEnter()
    }
    
    onExit() {
        R.remove(this.background);
        R.remove(this.repairCabinet)

        // call on exit
        this.repairCabinet.onExit()
    }
}