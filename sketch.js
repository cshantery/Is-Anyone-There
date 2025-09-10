let timer;
let size = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  timer = new Timer(10000);
}

function draw() {
  background(20);
  fill(255, 255, 255);
  rect(width/2 - (size / 2), height/2 - (size / 2), size, size);
  

  textSize(16);
  textAlign(RIGHT, TOP);
  text(timer.getSeconds(), width - 10, 10);

  if(timer.isFinished()){
    timer.reset();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  console.log("clicked! : ", mouseX, mouseY);
}