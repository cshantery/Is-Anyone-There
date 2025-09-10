class Button {
    constructor(x, y, size, onClick = () => {}){
        this.x = x;
        this.y = y;
        this.size = size;
        this.onClick = onClick;

        this.baseColor = color(200);
        this.hoverColor = color(150);
    }

    isMouseInBounds(){
        return (
            mouseX >= this.x && mouseX <= this.x + this.size &&
            mouseY >= this.y && mouseY <= this.y + this.size
        );
    }

    update(dt){

    }

    draw(){
        let color = this.isMouseInBounds() ? this.hoverColor : this.baseColor;
        push();
        noStroke()
        fill(color);
        rect(this.x, this.y, this.size, this.size, 8);
        pop();
    }

    mousePressed() {
        if (this.isMouseInBounds()) {
            this.onClick(this)
        };
    }
}