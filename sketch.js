let R;

let v1, v2, v3, v4;
let room;

let startScreen; 
let showStartScreen = true; 

function setup() {
    createCanvas(windowWidth, windowHeight);
    R = new Renderer();

     // for start screen 
    startScreen = new StartScreen(() => {
        showStartScreen = false; 
        setupRoom();
    })
}

function draw() {
    background(20);
    const dt = deltaTime / 1000;

    if(showStartScreen){
        startScreen.update(dt);
        startScreen.draw(); 
    } else {
        R.update(dt);
        R.draw()
    }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
      if(showStartScreen) {
        startScreen.mousePressed();
    } else { 
    R.dispatch("mousePressed")
    }
    console.log("clicked! : ", mouseX, mouseY);
}
function keyPressed() {
    R.dispatch("keyPressed");
}

// function mousePressed() {
//     if(showStartScreen) {
//         startScreen.mousePressed();
//     } else { 
//     R.dispatch("mousePressed")
//     }
// }
function mouseReleased() {
    R.dispatch("mouseReleased");
}

function setupRoom() {
    v1 = new EventView();
    v2 = new TimerView();
    v3 = new MoveView();
    v4 = new View(238, 130, 238, "Room 4");

    room = new ViewManager();
    room.addView(v1);
    room.addView(v2);
    room.addView(v3);
    room.addView(v4);
    R.add(room);
}