class RepairToolCabinet{
    constructor(x, y, scale, onClick = () => {}) {
        this.x = x;
        this.y = y;
        this.scale = scale;

        // constants
        this.clicksToBreak = 10; // break lock
        // for hitbox
        this.width = 4
        this.height = 3

        // cabinet
        this.closedSprite = SM.get("closedRepair");
        this.closedSprite.setPos(this.x, this.y);
        this.closedSprite.setScale(this.scale);
        
        this.openSprite = SM.get("openRepair");
        this.openSprite.setPos(this.x, this.y);
        this.openSprite.setScale(this.scale);

        // items - scale and pos manually set for now
        this.voltimeter = SM.get("voltimeter");
        this.voltimeter.setPos(this.x+2.3, this.y+1.72);
        this.voltimeter.setScale(0.08);

        this.electricalTape = SM.get("electricalTape");
        this.electricalTape.setPos(this.x+1.2, this.y+1.95);
        this.electricalTape.setScale(0.1);

        // --- lock visuals and mechanics
        // should be in lower right corner of repair tool cabinet, manually placed for now
        this.lockSprite = SM.get("rustyLock")
        this.lockSprite.setPos(this.x+1.9, this.y+2.2);
        this.lockSprite.setScale(0.1);

        this.animationPlaying = false;
        this.clicks = 0;
        this.lockBroken = false;


        this.onClick = onClick;
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

    update(dt){
        // MAKE THIS TIME BASED NOT EXECUTION COUNT BASED
        if(this.animationPlaying){
            /* you can play around with these values for the animation. Just note that rotatio is in radians, so PI/180 is 1 degree.
            I made the speed and range of rotation increase with clicks so it seems like it's being pulled more the more u click it
            */
            this.lockSprite.setRotation(this.lockSprite.rotation + (this.clicks*(Math.PI/180)))
            
            if(this.lockSprite.rotation > (this.clicks*(Math.PI/45))){
                this.lockSprite.rotation = 0;
                this.animationPlaying = false;
            }
        }

    }

    onEnter() {
        R.add(this.closedSprite, 9)
        R.add(this.lockSprite, 10)
    }
    onExit() {
        R.remove(this.closedSprite);
        R.remove(this.lockSprite)
        R.add(this.openSprite)
    }

    mousePressed(p) {
        if (this.isMouseInBounds(p?.x, p?.y)) {
            this.onClick(this.clicks);

            // play quick animation to show lock moving
            this.animationPlaying = true;
            this.clicks += 1;

            if(this.clicks > this.clicksToBreak){
                this.lockBroken = true;

                R.remove(this.closedSprite)
                R.remove(this.lockSprite)

                R.add(this.openSprite)
                R.add(this.electricalTape)
                R.add(this.voltimeter)
            }
        }
    }
}

class RepairView extends View {
    constructor() {
        super(0,0,0,'');
        this.background = SM.get("MetalWall");
        this.background.setSize(16, 9);

        this.textNotificationHandler = new TextNotificationHandler(0.5, 0.85, {holdFadeoutFor: 2.5});

        this.repairCabinet = new RepairToolCabinet(1, 1, 0.4, (clickCount) => {
            if(clickCount == 0){
                this.textNotificationHandler.addText("A lock seems to be holding this cabinet shut.")
            }
            else if(clickCount == 2){
                this.textNotificationHandler.addText("This lock looks old...")
            }
        })
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