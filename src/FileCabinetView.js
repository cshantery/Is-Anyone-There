class FileCabinetObject {
    constructor(x, y, xsize, ysize, onClick = () => {}){
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
    constructor() {
        super(122, 122, 122, "");

        this.cabinets = []

        let randx;
        let randy;

        let cabinetWidth = 100;
        let cabinetHeight = 200;

        for(let i = 0; i < 4; i++){
            randx = Math.random() * (windowWidth - 2*cabinetWidth) + cabinetWidth
            randy = Math.random() * (windowHeight - 2*cabinetHeight) + cabinetHeight
            console.log(randx)
            console.log(randy)
            this.cabinets.push(new FileCabinetObject(randx, randy, cabinetWidth, cabinetHeight))
        }
    }

    draw(){
        super.draw();
        push();

        //textSize(20);
        //text("File Cabinet room" , width/2, height/2 + 40);
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