let R;

let v1, v2, v3, v4;
let room;

let startScreen; 
let showStartScreen = true; 

let gameFont; // could be changed, just adding to make startScreen look better

function preload() { 
    gameFont = loadFont('assets/font/PressStart2P-Regular.ttf')
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    R = new Renderer();

     // for start screen 
    startScreen = new StartScreen(() => {
        showStartScreen = false; 
        setupRoom();

        textFont('sans-serif') // resetting font for the game itself 
    });


    
    R.add(new ScreenTimer(), 99);
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
    if(!showStartScreen){
    R.dispatch("keyPressed");
    }
}

// function mousePressed() {
//     if(showStartScreen) {
//         startScreen.mousePressed();
//     } else { 
//     R.dispatch("mousePressed")
//     }
// }
function mouseReleased() {
    if(!showStartScreen){
    R.dispatch("mouseReleased");
    }
}

function setupRoom() {
    v1 = new ComputerView();
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