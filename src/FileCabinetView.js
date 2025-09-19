class FileCabinetObject {
    constructor(id, x, y, xsize, ysize, imageFile, onClick = () => {}){
        this.id = id; // for now just using index
        this.x = x;
        this.y = y;
        this.imageFile = imageFile;
        
        this.imageFile.resize(xsize, ysize);

        this.xsize = xsize;
        this.ysize = ysize;
        this.onClick = onClick;

        this.baseColor = color(200);
        this.hoverColor = color(150);
    }

    isMouseInBounds(){
        return (
            mouseX >= this.x && mouseX <= this.x + this.xsize &&
            mouseY >= this.y && mouseY <= this.y + this.ysize
        );
    }

    update(dt){

    }

    draw(){
        let color = this.isMouseInBounds() ? this.hoverColor : this.baseColor;
        push();
        noStroke()
        fill(color);
        //rect(this.x, this.y, this.xsize, this.ysize, 8);
        image(this.imageFile, this.x, this.y)
        pop();
    }

    mousePressed() {
        if (this.isMouseInBounds()) {
            this.onClick(this)
        };
    }
}

class FileCabinetView extends View {
    constructor(fcImg, cabinetCount=4) {
        super(172, 170, 172, "");
        this.fadoutRate = 0.03 // smaller, slower
        this.secretNumber = "8"; // number to display
        this.cabinets = []
        this.fcImg = fcImg

        // fadeout and stuff
        this.numberVisibility = 0; //for fadout, initially invisible

        this.lockedVisibility = 0;
        this.holdFadeout = false;
        this.timer = 0;

        let randx;
        let randy;

        let cabinetWidth = 150;
        let cabinetHeight = 300;

        let chosenCabinet = Math.floor(Math.random() * (cabinetCount)); // the one that hides the number

        for(let i = 0; i < cabinetCount; i++){
            randx = Math.random() * (windowWidth - 2*cabinetWidth) + cabinetWidth
            randy = Math.random() * (windowHeight - 2*cabinetHeight) + cabinetHeight
            this.cabinets.push(new FileCabinetObject(i, randx, randy, cabinetWidth, cabinetHeight,
                 this.fcImg,
                (obj) => {
                    if(obj.id == chosenCabinet){
                        console.log('You have clicked the chosen cabinet, it was id '+obj.id)
                        console.log(this.showNumber)
                        this.numberVisibility = 1 //make it totally visible
                    }
                    else{
                        console.log('This file cabinet is locked.')
                        this.lockedVisibility = 1;
                        this.holdFadeout = true;
                    }
                }
            ))
        }
    }

    draw(){
        super.draw();
        push();
        

        // // displaying number
        // // always exponentially decay visibility of number
        // this.numberVisibility = this.numberVisibility * (1-this.fadoutRate);

        // // set to 0 so it doesn't stay there for too long (while being barely visible, exp decay gets slower as visibility gets closer to 0)
        // if(this.numberVisibility < 0.1){
        //     this.numberVisibility = 0; 
        // }

        fill(0,0,0, 255*this.numberVisibility)
        textSize(250);
        text(this.secretNumber, windowWidth/2, windowHeight/2);

        // displaying locked cabinet
        if(this.holdFadeout == false){
            this.lockedVisibility = this.lockedVisibility * (1-this.fadoutRate);
            if(this.lockedVisibility < 0.1){
                this.lockedVisibility = 0; 
            }
        }

        fill(0, 0, 0, 255*this.lockedVisibility)
        textSize(30)
        text("This file cabinet is locked...", 30, 60)
        
        pop();
    }

    update(dt) {
        if(this.holdFadeout){
            this.timer += dt;

            // if text has been on screen for 1 seconds, enable fadeout
            if(this.timer > 1){
                this.holdFadeout = false;
                this.timer = 0;
            }
        }
    }

    keyPressed() {
    }

    mousePressed(){
        console.log(mouseX)
        console.log(mouseY)
    }

    onEnter() {
        for(let c of this.cabinets){
            R.add(c)
        }
    }

    onExit() {
        for(let c of this.cabinets){
            R.remove(c)
        }
    }
}