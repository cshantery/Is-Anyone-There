// globals

// N, E, S, W
const orientations = ['N', 'E', 'S', 'W']
let curOrientation = 'N';

let showText = false;
let myText = "";
let textX, textY; // To store the click coordinates

// Add coordinates of hitboxes you want
//Detection Format: [xStart, xEnd, yStart, yEnd]
const MiddleObject = [300, 350, 300, 450]
const LeftObject = [100, 200, 300, 350]
const RightObject = [475, 525, 325, 375]

// add "hitbox" objects to Orientation List
const NorthCords = [MiddleObject, LeftObject, RightObject]
const SouthCords = [MiddleObject, RightObject]
const EastCords = [LeftObject, RightObject]
const WestCords = [MiddleObject, LeftObject]

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// functions
function updateOrientation(direction){
    /*
    direction: 'left' or 'right'

    'right' moves orientation clockwise (think of compass)
    'left' moves counterclockwise

    apparently javascript's % does not work as expected for negative numbers, we can use n % mod => ((n%m)+m)%m
    */

    ind = orientations.indexOf(curOrientation); 
    if(direction == 'left'){
        curOrientation = orientations[(((ind-1)%4)+4)%4]
    }
    else if(direction == 'right'){
        curOrientation = orientations[(((ind+1)%4)+4)%4]
    }
}

function draw() {
  background(20);
  fill(255, 255, 255);

  textSize(50)
  text(`Facing ${curOrientation}`, width/2, height/2)

  if (showText) {
    textSize(24);
    text(myText, width/2, height/2 + 150); 
  }

  //Unique Events
  if(curOrientation === 'N') {
    for(let i = 0; i < NorthCords.length; i+=1)     {
      let shapeCords = NorthCords[i];
      rect(shapeCords[0], shapeCords[2], shapeCords[1] - shapeCords[0], shapeCords[3] - shapeCords[2]);
    }
  }
  if(curOrientation === 'S') {
    for(let i = 0; i < SouthCords.length; i+=1)     {
      let shapeCords = SouthCords[i];
      rect(shapeCords[0], shapeCords[2], shapeCords[1] - shapeCords[0], shapeCords[3] - shapeCords[2]);
    }
  }
  if(curOrientation === 'E') {
    for(let i = 0; i < EastCords.length; i+=1)     {
      let shapeCords = EastCords[i];
      rect(shapeCords[0], shapeCords[2], shapeCords[1] - shapeCords[0], shapeCords[3] - shapeCords[2]);
    }
  }
  if(curOrientation === 'W') {
    for(let i = 0; i < WestCords.length; i+=1)     {
      let shapeCords = WestCords[i];
      rect(shapeCords[0], shapeCords[2], shapeCords[1] - shapeCords[0], shapeCords[3] - shapeCords[2]);
    }
  }

}

function mousePressed(){
  if(curOrientation === 'N') {
    for(let i = 0; i < NorthCords.length; i+=1)         {
        let shapeCords = NorthCords[i];
        if(shapeCords[0] < mouseX && mouseX < shapeCords[1] && shapeCords[2] < mouseY && mouseY < shapeCords[3]) {
          showText = true;
          myText = `Orientation ${curOrientation} - Event ${i}`;
        }
      }
  }
  else if(curOrientation === 'S') {
    for(let i = 0; i < SouthCords.length; i+=1)         {
        let shapeCords = SouthCords[i];
        if(shapeCords[0] < mouseX && mouseX < shapeCords[1] && shapeCords[2] < mouseY && mouseY < shapeCords[3]) {
          showText = true;
          myText = `Orientation ${curOrientation} - Event ${i}`;
        }
      }
  }
  else if(curOrientation === 'E') {
    for(let i = 0; i < EastCords.length; i+=1)         {
        let shapeCords = EastCords[i];
        if(shapeCords[0] < mouseX && mouseX < shapeCords[1] && shapeCords[2] < mouseY && mouseY < shapeCords[3]) {
          showText = true;
          myText = `Orientation ${curOrientation} - Event ${i}`;
        }
      }
  }
  else if(curOrientation === 'W') {
    for(let i = 0; i < WestCords.length; i+=1)         {
        let shapeCords = WestCords[i];
        if(shapeCords[0] < mouseX && mouseX < shapeCords[1] && shapeCords[2] < mouseY && mouseY < shapeCords[3]) {
          showText = true;
          myText = `Orientation ${curOrientation} - Event ${i}`;
        }
      }
  }
}

function keyPressed(){
  if(key == 'ArrowLeft'){
    updateOrientation('left')
    showText = false;
  }
  else if(key == 'ArrowRight'){
    updateOrientation('right')
    showText = false;
    }
}