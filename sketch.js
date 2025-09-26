let cnv;
let R;
let SM = new SpriteManager(); // Sprite Manager

// Views and game elements
let startScreen;
let fcView, otherView, v1, v2, v3, v4, room;

// Assets
let backgroundFC;
let gameFont;

function fit16x9() {
  const k = Math.min(windowWidth / 16, windowHeight / 9);
  const W = Math.floor(16 * k);
  const H = Math.floor(9 * k);

  if (!cnv) {
    cnv = createCanvas(W, H);
  } else {
    resizeCanvas(W, H);
  }

  // Center canvas
  const x = Math.floor((windowWidth - W) / 2);
  const y = Math.floor((windowHeight - H) / 2);
  cnv.position(x, y);
}

function preload() {
  loadSprites();

  gameFont     = loadFont('assets/font/PressStart2P-Regular.ttf');
  backgroundFC = loadImage('assets/background/EastWallNoFC&Paper.png');
}

function setup() {
  fit16x9();
  VM.updateUnits(); // compute VM.U / VM.V now that width/height exist

  R = new Renderer();

  startScreen = new StartScreenView(() => {
    R.selfRemove(startScreen);

    // Switch to game views
    textFont('sans-serif');
    setupRoom();
  });

  // High z so it draws on top until removed
  R.add(startScreen, 999);
}

function draw() {
  // Keep VM in sync each frame (handles window resizes, etc.)
  VM.updateUnits();
  VM.updateMouseFromP5();

  background(20);

  const dt = deltaTime / 1000;
  R.update(dt);
  R.draw();
}

function windowResized() {
  fit16x9();
  VM.updateUnits();
}

function mousePressed() {
  // Dispatch mouse in 16:9 unit space
  const m = VM.mouse();
  if (!VM.insideUnits(m)) return;
  // console.log(m.x, m.y);
  R.dispatch('mousePressed', m);
}

function mouseReleased() {
  R.dispatch('mouseReleased');
}

function keyPressed() {
  R.dispatch('keyPressed');
}

function setupRoom() {
  fcView    = new FileCabinetView();
  v1 = new ComputerView();
  v2 = new TimerView();
  v3 = new MoveView();

  room = new ViewManager();
  room.addView(v1);
  room.addView(v2);
  room.addView(v3);
  room.addView(fcView);

  R.add(room);
}
