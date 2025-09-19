class FileCabinetView extends View {
    constructor() {
        super(255, 99, 71, "");
    }

    draw(){
        super.draw();
        push();

        textSize(20);
        text("File Cabinet room" , width/2, height/2 + 40);
        pop();
    }

    update(dt) {
    }

    keyPressed() {
    }
}