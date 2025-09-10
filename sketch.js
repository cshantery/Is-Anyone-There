let R;
let timer;
let timeLabel;
let b;

function setup() {
  createCanvas(windowWidth, windowHeight);
  R = new Renderer();
  timer = new Timer(3000);

  let x = 100;
  let height = 100;
  let size = 60
  b = R.add(new Button(x, height, size, (self) => {
    R.selfRemove(self);
    b = R.add(new Button(x + 120, height, size, (self) => {
      R.selfRemove(self);
      b = R.add(new Button(x + 240, height, size, (self) => {
        
        if(!timer.isFinished()) {
          R.add(new Label(width/2, height, "You Won!"));
        } else {
          R.add(new Label(width/2, height, "You Ran Out of Time"));
        }
        R.selfRemove(self);
      }));
    }));
  }))

  timeLabel = R.add(new Label(width/2, height/3, timer.getSeconds()));
}

function draw() {
  background(20);
  const dt = deltaTime / 1000;
  R.update(dt);
  R.draw();
  timeLabel.setText(timer.getSeconds());
  if(timer.isFinished()){
    R.remove(b);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  R.dispatch("mousePressed");
  console.log("clicked! : ", mouseX, mouseY);
}