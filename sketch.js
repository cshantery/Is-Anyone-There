const vWidth = 320;
const vHeight = 180;
const scale = 6;

let vw; // virtual window

let cnv; // canvas

let R;

let fcView, otherView;
let room;
// just for temporary development debugging
let preloadedAsset;
let backgroundFC;

let startScreen; 
let showStartScreen = true; 

let gameFont; // could be changed, just adding to make startScreen look better

function preload() { 
    gameFont = loadFont('assets/font/PressStart2P-Regular.ttf');
    backgroundFC = loadImage('assets/background/EastWallNoFC&Paper.png');
}

function setup() {
    cnv = createCanvas(vWidth * scale, vHeight * scale);

    vw = createGraphics(vWidth, vHeight);
    R = new Renderer();

     // for start screen 
    startScreen = new StartScreen(() => {
        showStartScreen = false; 
        setupRoom();

        textFont('sans-serif') // resetting font for the game itself 
    });


    
    setupRoom(preloadedAsset);
}

function draw() {
    vw.background(20);
    const dt = deltaTime / 1000;

    if(showStartScreen){
        startScreen.update(dt);
        startScreen.draw(); 
    } else {
        R.update(dt);
        R.draw();
    }



}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas(); // Just reposition, not resize
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

function setupRoom(temp) {
    fcView = new FileCabinetView(backgroundFC, temp);
    otherView = new View(238, 130, 238, "Some other orientation...");
    v1 = new ComputerView();
    v2 = new TimerView();
    v3 = new MoveView();
    v4 = new View(238, 130, 238, "Room 4");

    room = new ViewManager();
    room.addView(v1);
    room.addView(v2);
    room.addView(v3);
    room.addView(v4)
    room.addView(fcView);
    room.addView(otherView);
    R.add(room);
}