class MoveBlock {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.drag = false;
        this.dragDifference = [0,0];
        this.color = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
    }

    isMouseInBounds(){
        return (
            mouseX >= this.x && mouseX <= this.x + this.size &&
            mouseY >= this.y && mouseY <= this.y + this.size
        );
    }

    update(dt) {
        if(this.drag) {
            this.x = mouseX - this.dragDifference[0];
            this.y = mouseY - this.dragDifference[1];
        }
    }

    draw() {
        push();
        fill(this.color[0], this.color[1], this.color[2]);
        noStroke();
        rect(this.x, this.y, this.size, this.size, 20);
        pop();
    }

    mousePressed() {
        if(this.isMouseInBounds()){
            this.drag = true;
            this.dragDifference = [mouseX - this.x, mouseY - this.y];
        }
    }
    mouseReleased() {
        this.drag = false;
    }
}