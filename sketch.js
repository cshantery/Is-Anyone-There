// globals

// N, E, S, W
const orientations = ['N', 'E', 'S', 'W']
let curOrientation = 'N';

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

    console.log(curOrientation);
}

//
function setup() {
  createCanvas(windowWidth, windowHeight);
}

let size = 100;

function draw() {
  background(20);
  fill(255, 255, 255);

  textSize(50)
  text(`Facing ${curOrientation}`, width/2, height/2)
}

function keyPressed(){
  if(key == 'ArrowLeft'){
    updateOrientation('left')
  }
  else if(key == 'ArrowRight'){
    updateOrientation('right')
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  console.log("clicked! : ", mouseX, mouseY);
}