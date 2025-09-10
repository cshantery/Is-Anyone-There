let R;
let timerLabel;
let bttn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  R = new Renderer();
  testScreen();
}

function draw() {
  background(20);
  const dt = deltaTime / 1000;
  R.update(dt);
  R.draw();

  if(timerLabel.timer.isFinished()){
    R.remove(bttn);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  R.dispatch("mousePressed");
  console.log("clicked! : ", mouseX, mouseY);
}

function testScreen() {
  const time = 5;
  timerLabel = R.add(new CountdownLabel(width / 2, height / 5, time, (self) => {
    R.selfRemove(self);
    R.add(new Label(width / 2, height / 5, "Countdown End!"));
  }))

  const size = 50;
  const step = 100;
  const steps = [
    step, step*2, step*3, step*4, step*5, step*6, step*7, step*8
  ]
  spawnButton(0, steps, size);
}

function spawnButton(i = 0, steps, size) {
  if (i >= steps.length) {
    R.remove(timerLabel);
    R.add(new Label(width / 2, height / 5, "You Won"));
    return;
  }
  if (timerLabel.timer.isFinished()) return;

  const pos = steps[i];
  bttn = R.add(new Button(pos, height/2, size, (self) => {
    R.selfRemove(self);
    spawnButton(i + 1, steps, size);
  }));
}