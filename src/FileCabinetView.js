class FileCabinetObject {
    constructor(id, x, y, xsize, ysize, onClick = () => {}){
        this.id = id; // for now just using index
        this.x = x;
        this.y = y;
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
        rect(this.x, this.y, this.xsize, this.ysize, 8);
        pop();
    }

    mousePressed() {
        if (this.isMouseInBounds()) {
            this.onClick(this)
        };
    }
}

class FileCabinetView extends View {
    constructor(cabinetCount=4) {
        super(122, 122, 122, "");

        this.cabinets = []

        this.numberVisibiliy = 0; //for fadout, initially invisible
        this.fadoutRate = 0.03 // smaller, slower

        this.secretNumber = "8"; // number to display

        let randx;
        let randy;

        let cabinetWidth = 100;
        let cabinetHeight = 200;

        let chosenCabinet = Math.floor(Math.random() * (cabinetCount)); // the one that hides the number

        for(let i = 0; i < cabinetCount; i++){
            randx = Math.random() * (windowWidth - 2*cabinetWidth) + cabinetWidth
            randy = Math.random() * (windowHeight - 2*cabinetHeight) + cabinetHeight
            this.cabinets.push(new FileCabinetObject(i, randx, randy, cabinetWidth, cabinetHeight,
                (obj) => {
                    if(obj.id == chosenCabinet){
                        console.log('You have clicked the chosen cabinet, it was id '+obj.id)
                        console.log(this.showNumber)
                        this.numberVisibiliy = 1 //make it totally visible
                    }
                    else{
                        console.log('This file cabinet is locked.')
                    }
                }
            ))
        }
    }

    draw(){
        super.draw();
        push();
        
        // always exponentially decay visibility of number
        this.numberVisibiliy = this.numberVisibiliy * (1-this.fadoutRate);

        // set to 0 so it doesn't stay there for too long (while being barely visible, exp decay gets slower as visibility gets closer to 0)
        if(this.numberVisibiliy < 0.1){
            this.numberVisibiliy = 0; 
        }

        fill(0,0,0, 255*this.numberVisibiliy)
        textSize(250);
        text(this.secretNumber, windowWidth/2, windowHeight/2);
        
        pop();
    }

    update(dt) {
        
    }

    keyPressed() {
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