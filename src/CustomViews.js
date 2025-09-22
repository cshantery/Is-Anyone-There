class ComputerView extends View {

    constructor() {
        super(58, 134, 255, "");
        this.text = "";
        this.ComputerIsOpen_ = false;

        this.ScreenWidth_ = width - 200;
        this.ScreenHeight_ = height - 100;

        this.bttn = new ConditionalButton(width/2 - 100, height/1.5 - 50, 200, () => {
            this.openComputer();
        }, true, 128, 128, 128);

        this.closebttn = new ConditionalButton(width/2+this.ScreenWidth_/2-20, height/2-this.ScreenHeight_/2-20, 50, () => {
            this.closeComputer();
        }, false, 200, 35, 35);

        this.pinbttn = new ConditionalButton(width/2 + 300, height/1.5 - 50, 60, () => {
            this.openComputer();
        }, true, 255, 255, 255);
    }

    draw(){
        super.draw();
        push();
        fill(0, 0, 0);
        textSize(50);
        if(this.ComputerIsOpen_) {
            stroke(100);
            strokeWeight(10);
            rect(width/2 - this.ScreenWidth_/2, height/2- this.ScreenHeight_/2, this.ScreenWidth_, this.ScreenHeight_);
            this.closebttn.CanDraw();
            this.bttn.NotDraw();
            this.pinbttn.NotDraw();
        }

        if(!this.ComputerIsOpen_) {
            this.bttn.CanDraw();
            this.closebttn.NotDraw();
            this.pinbttn.CanDraw();
        }

        textSize(20);
        textAlign(CENTER);
        pop();
    }

    openComputer() {
        this.ComputerIsOpen_ = true;
    }

    closeComputer() {
        this.ComputerIsOpen_ = false;
    }

    onEnter() {
        R.add(this.bttn);
        R.add(this.closebttn);
        R.add(this.pinbttn);
    }

    onExit() {
        R.remove(this.bttn);
        R.remove(this.closebttn);
        R.remove(this.pinbttn);
    }

}

class TimerView extends View {
    constructor() {
        super(255, 99, 71, "Room 2 - Timer");
        this.timer = new Timer(30000);
        this.timeLabel = 0;
    }

    draw(){
        super.draw();
        push();
        fill(0, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(50);
        text(this.timeLabel , width/2, height/4);

        textSize(20);
        text("Press Space To reset Timer" , width/2, height/2 + 40);
        pop();
    }

    update(dt) {
        this.timeLabel = this.timer.getSeconds();
    }

    keyPressed() {
        if(keyCode === 32) this.timer.reset();
    }
}

class EventView extends View {
    constructor() {
        super(58, 134, 255, "Room 1");
        this.text = "";
        this.bttn1 = new Button(width/2 - 100, height/1.5, 50, () => {
            this.text = "Event 1";
        });
        this.bttn2 = new Button(width/2, height/1.5, 50, () => {
            this.text = "Event 2";
        });
        this.bttn3 = new Button(width/2 + 100, height/1.5, 50, () => {
            this.text = "Event 3";
        });
    }

    draw(){
        super.draw();
        push();
        fill(0, 0, 0);
        textSize(50);
        text(this.text, width/2, height/4);

        textSize(20);
        textAlign(CENTER);
        text("Press Buttons To Show Events" , width/2, height/2 + 40);
        pop();
    }

    onEnter() {
        R.add(this.bttn1);
        R.add(this.bttn2);
        R.add(this.bttn3);
    }

    onExit() {
        R.remove(this.bttn1);
        R.remove(this.bttn2);
        R.remove(this.bttn3);
    }
}

class MoveView extends View {
    constructor() {
        super(60, 179, 113, "Room 3");
        this.block1 = new MoveBlock(width/1.5, height/1.5, 100);
        this.block2 = new MoveBlock(width/4, height/4, 100);
        this.block3 = new MoveBlock(width/4, height/1.5, 100);
        this.block4 = new MoveBlock(width/1.5, height/4, 100);
    }

    draw() {
        super.draw();
        push();
        textSize(20);
        textAlign(CENTER);
        text("Move the Boxes around!" , width/2, height/2 + 40);
        pop();
    }

    onEnter() {
        R.add(this.block1);
        R.add(this.block2);
        R.add(this.block3);
        R.add(this.block4);
    }

    onExit() {
        R.remove(this.block1);
        R.remove(this.block2);
        R.remove(this.block3);
        R.remove(this.block4);
    }
}