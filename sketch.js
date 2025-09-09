function setup() {
  createCanvas(windowWidth, windowHeight);
}

let size = 100;
let timerVal = 10
let startTime

function draw() {
  background(20);
  fill(255, 255, 255);
  rect(width/2 - (size / 2), height/2 - (size / 2), size, size);
  
  if(frameCount % 60 == 0 && timerVal >= 1){
    timerVal--; 
  }

  textSize(16);
  textAlign(RIGHT, TOP);
  text(timerVal, width - 10, 10);

  if(timerVal == 0){
      text("test", width - 10, 30);
    }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  console.log("clicked! : ", mouseX, mouseY);
}