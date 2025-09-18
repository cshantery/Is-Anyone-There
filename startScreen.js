class StartScreen { 
    constructor(startNow) {
        this.title = "Is Anyone There?"; 
        this.instruction = "Click to Begin!"
        this.onStart = startNow; 

        // creating the start button 
        this.startButton = new Button(windowWidth / 2 - 40, windowHeight / 2 + 60, 80, () => {
        if (this.onStart) this.onStart();
    });
    }

    draw() {
        background(30);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(48);
        text(this.title, windowWidth/2, windowHeight/2 - 50);

        textSize(24);
        text(this.instruction, windowWidth/2, windowHeight/2 + 20);

        this.startButton.draw(); 
    }

    mousePressed(){
        this.startButton.mousePressed();
    }

    update(dt){
        this.startButton.update(dt);
    }
}
