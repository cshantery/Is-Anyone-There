function setup() {
  createCanvas(windowWidth, windowHeight);
}

let size = 100;

function draw() {
  background(20);
  fill(255, 255, 255);
  rect(width/2 - (size / 2), height/2 - (size / 2), size, size);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  console.log("clicked! : ", mouseX, mouseY);
}