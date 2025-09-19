let R;

let fcView, otherView;
let room;

// just for temporary development debugging
let preloadedAsset;

function preload(){
    console.log('PRELOADING ')
    preloadedAsset = loadImage(
    'assets/testObjects/filecabinet.png',
    (img) => {
      console.log('Loaded:', img.width, img.height);
    },
    (err) => {
      console.error('Failed to load image', err);
    }
  );
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    R = new Renderer();
    setupRoom(preloadedAsset);
}

function draw() {
    background(20);
    const dt = deltaTime / 1000;
    R.update(dt);
    R.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    R.dispatch("mousePressed");
    console.log("clicked! : ", mouseX, mouseY);
}
function keyPressed() {
    R.dispatch("keyPressed");
}
function mousePressed() {
    R.dispatch("mousePressed")
}
function mouseReleased() {
    R.dispatch("mouseReleased");
}

function setupRoom(temp) {
    fcView = new FileCabinetView(temp);
    otherView = new View(238, 130, 238, "Some other orientation...");

    room = new ViewManager();
    room.addView(fcView);
    room.addView(otherView);
    R.add(room);
}