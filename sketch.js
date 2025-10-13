let cnv;
let R;
let SM = new SpriteManager(); // Sprite Manager
let GS;
let WORLD;

let endscreenShown = false;
let ended = false;

// Interface state tracking
let activeInterface = null; // tracks if Terminal, Pinpad, or other interface is active

// Views and game elements
let startScreen;
let room;

// Assets
let gameFont;
let terminusFont;
let startScreenMusic;
let henryAudio;
let henryImage;
let screenTimer;

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
  terminusFont = loadFont('assets/font/terminus.ttf');

  // Load start screen music
  startScreenMusic = loadSound('assets/Is_Anybody_There.mp3');
  
  // Load henry password sequence assets
  henryAudio = loadSound('assets/secrets/henry/connectionTerminated.mp3');
  henryImage = loadImage('assets/secrets/henry/connectionTerminated.jpg');
}

function setup() {
  fit16x9();
  VM.updateUnits(); // compute VM.U / VM.V now that width/height exist

  const savedState = localStorage.getItem('currentGameState');

  if(savedState){
    console.log("saved state found...");
    const savedData = JSON.parse(savedState);
    GS = new GameState();
    if(savedData.solved && GS.is("Game Complete")) {
      GS.unset("Game Complete")
    }
    if(savedData.timerUp && GS.is("Timer Up")) {
      GS.unset("Timer Up")
    }
  } else{
    console.log("no state found, creating new state...");
    GS = new GameState();
  }

  // insert checkers here
  GS.checkFor("Ended", () => { return GS.is("Game Complete") || GS.is("Timer Up") || GS.is("Player Died"); })

  R = new Renderer();

  startScreen = new StartScreenView(() => {
    if (startScreenMusic && startScreenMusic.isPlaying()) startScreenMusic.stop();
    R.selfRemove(startScreen);

    screenTimer = new ScreenTimer(() => { });
    R.add(screenTimer, 1);

    setupWorld(); // ⬅️ new
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
  if(!ended) {
    endScreen = new EndScreenView(GS.is("Game Complete")); //update endscreen state
  }

  if(GS.is("Ended")) {
    ended = true;
    /* -- Implement Tracking Deaths across restarts -- */
    //if(!GS.getSolved()) {
      //GS.incrementDeaths();
    //}

    if(!endscreenShown) {
      R.add(endScreen, 999);
      endscreenShown = true;
    }
  }
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
  if (R) R.dispatch('mousePressed', m);
}

function mouseDragged() {
  const m = VM.mouse();
  if (!VM.insideUnits(m)) return;
  R.dispatch('mouseDragged', m);
}

function mouseReleased() {
  if (R) R.dispatch('mouseReleased');
}

function keyPressed() {
  if (R) R.dispatch('keyPressed');
}

// Debug function to check and reset interface state
function debugInterface() {
  console.log("=== Interface Debug Info ===");
  console.log("window.activeInterface:", window.activeInterface);
  console.log("global activeInterface:", activeInterface);
  console.log("Renderer objects count:", R ? R.objects.length : "No renderer");
  return {
    windowActive: window.activeInterface,
    globalActive: activeInterface,
    rendererCount: R ? R.objects.length : 0
  };
}

// Function to force reset interface state
function resetInterface() {
  console.log("Forcing interface reset");
  window.activeInterface = null;
  activeInterface = null;
  console.log("Interface reset complete");
}


function setupWorld() {
  WORLD = new WorldManager();

  // --- Room A (start here) ---
  const computerView = new ComputerView(); // start view (index 0)
  const boxesView    = new BoxesView();
  const fcView       = new FileCabinetView();

  // Door in Room A -> Room B (index 1), land on view 0
  const sdViewA = new SlidingDoorView([{
    x:12, y:2.5, scale:0.8,
    targetRoom: 1,         // <-- ROOM B
    targetViewIndex: 0,    // land on first plain color view
    lockedCondition : () => GS.is("Pin Solved")
  }]);

  const roomA = new ViewManager();
  roomA.addView(computerView);  // index 0 (start)

  roomA.addView(boxesView);
  roomA.addView(fcView);
  roomA.addView(sdViewA);
  sdViewA.setRoom?.(roomA);
  
  // --- Room B (Breaker Room)

  const repairView = new RepairView();
  const wiresView = new WiresView();

  // Door in Room B -> back to Room A (index 1), land on doorView (view 4)
  const EntranceB = new SlidingDoorView([{
    x:6, y:2, scale:2,
    targetRoom: 0,        // <-- to room A
    targetViewIndex: 4,
    lockedCondition : () => true
  }],SM.get("MetalWall"));

  // Door in Room B -> to Room D (index 4), land on view TBD
  const LifeSupportDoorB = new SlidingDoorView([{
    x:12, y:2, scale:1,
    targetRoom: null,        // not set yet
    targetViewIndex: 4,
    lockedCondition : () => false
  }],SM.get("MetalWall"));

  const roomB = new ViewManager();
  roomB.addView(repairView);
  roomB.addView(wiresView);
  roomB.addView(EntranceB);
  roomB.addView(LifeSupportDoorB);
  EntranceB.setRoom?.(roomB);
  LifeSupportDoorB.setRoom?.(roomB);

  // --- Room C (Cryo Chamber Room) ---
  //class PlainView extends View { constructor(r,g,b,label){ super(r,g,b,label); } }

  const windowView = new SpaceWindowView();
  const cryoView1 = new CryoView(0);
  const cryoView2 = new CryoView(1);
  const cryoView3 = new CryoView(2);
  const cryoView4 = new CryoView(3);

  // Door in Room C -> back to Room B (index 1), land on wireView (view 1)
  const sdViewC = new SlidingDoorView([{
    x:12, y:2, scale:1,
    targetRoom: 1,        // <-- to room B
    targetViewIndex: 1,
    lockedCondition : () => true
  }],SM.get("MetalWall"));

  const roomC = new ViewManager();
  roomC.addView(cryoView1);
  roomC.addView(cryoView2);
  roomC.addView(windowView);
  roomC.addView(cryoView3);
  roomC.addView(cryoView4);
  roomC.addView(sdViewC);
  sdViewC.setRoom?.(roomC);

  // register rooms (A=0, B=1, C=2) and let WORLD receive key events
  WORLD.addRoom(roomA);   // index 0
  WORLD.addRoom(roomB);   // index 1
  WORLD.addRoom(roomC);   // index 2
  R.add(WORLD, 1000);
}
