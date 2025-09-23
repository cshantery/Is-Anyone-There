let R;

let fcView, otherView;
let room;

function setup() {
    createCanvas(windowWidth, windowHeight);
    R = new Renderer();
    setupRoom();
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

function setupRoom() {
    fcView = new FileCabinetView();
    otherView = new View(238, 130, 238, "Some other orientation...");

    room = new ViewManager();
    room.addView(fcView);
    room.addView(otherView);
    R.add(room);
}