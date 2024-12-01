/**
 * The available moves are (clockwise)
 * U : top layer
 * D : bottom layer 
 * R : rightmost layer
 * L : leftmost layer
 * F : front layer
 * B : back layer
 * ------ Slice moves
 * M : vertical middle layer (front facing)
 * E : horizontal middle layer 
 * S : vertical middle layer (side facing)
 * 
 * ## Their **counter-clockwise** versions are represented 
 * with the same letters but lowerscase.
 */

/**
 * There are 3 axis 
 * 0 X
 *      L M R 
 * 1 Y
 *      U E D
 * 2 Z
 *      F S B
 * 
 */
// var moves = [
//     "U", "D", "R", "L", "F", "B",
//     "u", "d", "r", "l", "f", "b",
//     "M", "E", "S",
//     "m", "e", "s",
// ];

var rotationAngle = 10;  // MUST be a factor of 90
var animationTimer = 15; // delay in milliseconds
var currentAngle = 0;
var interval;
var isAnimating = false;
var animationQueue = [];

function animate(action) {
  if (isAnimating) {
    animationQueue.push(action);
    return;
  }

  isAnimating = true;
  interval = setInterval(function () {
    rotation(action);
    if (!isAnimating && animationQueue.length > 0) {
      animate(animationQueue.shift());
    }
  }, animationTimer);
}

var moves = [
  "L", "M", "R",
  "U", "E", "D",
  "F", "S", "B"
];

function getMousePositionInElement(evt, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}


function rotation(face) {
  // Determine the main axis and layer value based on the face
  let mainAxis, value;
  switch (face.toUpperCase()) {
    case "L": case "M": case "R": mainAxis = 0; value = (face === "L" ? -1 : face === "R" ? 1 : 0); break;
    case "U": case "E": case "D": mainAxis = 1; value = (face === "U" ? -1 : face === "D" ? 1 : 0); break;
    case "F": case "S": case "B": mainAxis = 2; value = (face === "F" ? -1 : face === "B" ? 1 : 0); break;
  }

  // Incrementally rotate the layer
  currentAngle += rotationAngle;
  //applyPartialRotation(face, currentAngle, mainAxis);
  
  //let value;
  switch (mainAxis) {
    case 0: value = (face === "L" ? -1 : face === "R" ? 1 : 0); break;
    case 1: value = (face === "U" ? -1 : face === "D" ? 1 : 0); break;
    case 2: value = (face === "F" ? -1 : face === "B" ? 1 : 0); break;
  }

  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      for (let z = -1; z < 2; z++) {
        if (cubePosition[x + 1][y + 1][z + 1][mainAxis] === value) {
          const m = getRotationMatrix(x, y, z);
          const rotationMatrix = rotate(radians(currentAngle), mainAxis);
          setRotationMatrix(x, y, z, multiply(m, rotationMatrix));
        }
      }
    }
  }
  window.draw();

  if (currentAngle >= 90) {
    clearInterval(interval); // Stop animation
    currentAngle = 0; // Reset for the next rotation
    isAnimating = false;
    updatePosition(face); // Update logical state
    //draw(); // Redraw final state
  }
}


function updatePosition(face){
  var i, j, k, val;
  switch (face){
    case "L":
      i = 0; j = 2; k = 1; val = -1;
      break;
    case "l":
      i = 0; j = 1; k = 2; val = -1;
      break;
    case "R":
      i = 0; j = 1; k = 2; val = 1;
      break;
    case "r":
      i = 0; j = 2; k = 1; val = 1;
    break;
    case "T":
      i = 1; j = 2; k = 0; val = 1;
    break;
    case "t":
      i = 1; j = 0; k = 2; val = 1;
    break;
    case "B":
      i = 1; j = 0; k = 2; val = -1;
    break;
    case "b":
      i = 1; j = 2; k = 0; val = -1;
    break;
    case "E":
      i = 1; j = 0; k = 2; val = 0;
    break;
    case "e":
      i = 1; j = 2; k = 0; val = 0;
    break;
    case "F":
      i = 2; j = 0; k = 1; val = 1;
    break;
    case "f":
      i = 2; j = 1; k = 0; val = 1;
    break;
    case "S":
      i = 2; j = 0; k = 1; val = 0;
    break;
    case "s":
      i = 2; j = 1; k = 0; val = 0;
    break;
    case "K":
      i = 2; j = 1; k = 0; val = -1;
    break;
    case "k":
      i = 2; j = 0; k = 1; val = -1;
    break;
    case "M":
      i = 0; j = 2; k = 1; val = 0;
    break;
    case "m":
      i = 0; j = 1; k = 2; val = 0;
    break;
  }
  for (x = -1; x < 2; x++) {
    for (y = -1; y < 2; y++) {
      for (z = -1; z < 2; z++) {
        swap(x, y, z, i, j, k, val);
      }
    }
  }
}

function swap(x, y, z, i, j, k, val){
  var tmp = [];
  if (cubePosition[x+1][y+1][z+1][i] == val) {
    tmp = cubePosition[x+1][y+1][z+1][j];
    cubePosition[x+1][y+1][z+1][j] = cubePosition[x+1][y+1][z+1][k];
    cubePosition[x+1][y+1][z+1][k] = -tmp;
    tmp = cubePosition[x+1][y+1][z+1][3][k];
    cubePosition[x+1][y+1][z+1][3][k] = negate(cubePosition[x+1][y+1][z+1][3][j]);
    cubePosition[x+1][y+1][z+1][3][j] = tmp;
  }
}


