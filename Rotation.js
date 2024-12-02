/**
 * Conventionally the available moves are (clockwise)
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
 *      3 layers for each axis -1 0 1
 * 1 Y
 * 2 Z
 *    
 * and 2 direction clockwise = 0, counter-clockwise = 1
 */


// var moves = [
//   "L", "M", "R",
//   "U", "E", "D",
//   "F", "S", "B"
// ];

var rotationAngle = 10;  // factor of 90 so we can draw in between animations
var animationTimer = 15; // delay for animation
var currentAngle = 0;
var interval;
var isAnimating = false;
var animationQueue = [];

/**
 * Creates the animation from the given move
 * @param  action  {cube: ..., mainAxis: ..., direciton: ...}
 */
function animate(action) {
  if (isAnimating) {
    animationQueue.push(action);
    return;
  }

  isAnimating = true;
  interval = setInterval(function () {
    rotation(action.cube, action.mainAxis, action.direction);
    if (!isAnimating && animationQueue.length > 0) {
      animate(animationQueue.shift());
    }
  }, animationTimer);
}


/**
 * returns the mouse position in canvas
 * @param {Event} evt the event
 * @param {*} element  the canvas
 * @returns 
 */
function getMousePositionInElement(evt, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

/**
 * This performs the face rotations
 * @param {Cubo} cube the cube selected
 * @param {number} mainAxis  x : 0, y : 1, z : 2
 * @param {number} direction 0 : clockwise 1 : counter-clockwise
 */
function rotation(cube, mainAxis, direction) {

  currentAngle += rotationAngle;

  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      for (let z = -1; z < 2; z++) {
        //console.log(cubePosition[x + 1][y + 1][z + 1][mainAxis],Math.round(cube.transform[(mainAxis * 4) + 3]));
        if (cubePosition[x + 1][y + 1][z + 1][mainAxis] === Math.round(cube.transform[(mainAxis * 4) + 3])) {

          if (x == 0 && y == 0 && z == 0) {
            continue;
          }
          const m = getRotationMatrix(x, y, z);
          const rotationMatrix = rotate(radians(direction === 0 ? rotationAngle : -rotationAngle), mainAxis);
          //console.log(multiply(m, rotationMatrix));
          setRotationMatrix(x, y, z, multiply(m, rotationMatrix));
        }
      }
    }


    window.draw();

    if (currentAngle >= 90) {
      clearInterval(interval); // Stop animation
      currentAngle = 0; // Reset for the next rotation
      isAnimating = false;
      //rotateIndices(mainAxis, direction, cube);
    }

  }
}

function rotateIndices(mainAxis, direction, cube) {

  let cubex = Math.round(cube.transform[3]) + 1;
  let cubey = Math.round(cube.transform[7]) + 1;
  let cubez = Math.round(cube.transform[11]) + 1;

  let len = 3;

  if (direction == 0) {
    //  clockwise
    for (let i = 0; i < 3 / 2; i++) {
      for (let j = i; j < len - 1; j++) {

        let temp;
        switch (mainAxis) {
          case 0:
            console.log(cubePosition[cubex][i][j][3]);
            // temp = cubePosition[cubex][i][j][4];

            // cubePosition[cubex][i][j][4] = cubePosition[cubex][len - 1 - j + i][i][4];
            // cubePosition[cubex][len - 1 - j + i][i][4] = cubePosition[cubex][len - 1][len - 1 - j + i][4];
            // cubePosition[cubex][len - 1][len - 1 - j + i][4] = cubePosition[cubex][j][len - 1][4];
            // cubePosition[cubex][j][len - 1][4] = temp;

            temp = cubePosition[cubex][i][j][3];

            cubePosition[cubex][i][j][3] = cubePosition[cubex][len - 1 - j + i][i][3];
            cubePosition[cubex][len - 1 - j + i][i][3] = cubePosition[cubex][len - 1][len - 1 - j + i][3];
            cubePosition[cubex][len - 1][len - 1 - j + i][3] = cubePosition[cubex][j][len - 1][3];
            cubePosition[cubex][j][len - 1][3] = temp;

            break;
          case 1:
            console.log(cubey);
            temp = cubePosition[i][cubey][j][4];
            cubePosition[i][cubey][j][4] = cubePosition[cubey][len - 1 - j + i][i][4];
            cubePosition[len - 1 - j + i][cubey][i][4] = cubePosition[cubey][len - 1][len - 1 - j + i][4];
            cubePosition[len - 1][cubey][len - 1 - j + i][4] = cubePosition[cubey][j][len - 1][4];
            cubePosition[j][cubey][len - 1][4] = temp;

            // temp = cubePosition[i][cubey][j][3];
            // cubePosition[i][cubey][j][3] = cubePosition[cubey][len - 1 - j + i][i][3];
            // cubePosition[len - 1 - j + i][cubey][i][3] = cubePosition[cubey][len - 1][len - 1 - j + i][3];
            // cubePosition[len - 1][cubey][len - 1 - j + i][3] = cubePosition[cubey][j][len - 1][3];
            // cubePosition[j][cubey][len - 1][3] = temp;

            break;
          case 2:
            temp = cubePosition[i][j][cubez][4];
            cubePosition[i][j][cubez][4] = cubePosition[len - 1 - j + i][i][cubez][4];
            cubePosition[len - 1 - j + i][i][cubez][4] = cubePosition[len - 1][len - 1 - j + i][cubez][4];
            cubePosition[len - 1][len - 1 - j + i][cubez][4] = cubePosition[j][len - 1][cubez][4];
            cubePosition[j][len - 1][cubez][4] = temp;


            // temp = cubePosition[i][j][cubez][3];
            // cubePosition[i][j][cubez][3] = cubePosition[len - 1 - j + i][i][cubez][3];
            // cubePosition[len - 1 - j + i][i][cubez][3] = cubePosition[len - 1][len - 1 - j + i][cubez][3];
            // cubePosition[len - 1][len - 1 - j + i][cubez][3] = cubePosition[j][len - 1][cubez][3];
            // cubePosition[j][len - 1][cubez][3] = temp;
            break;
        }

      }
      len--;
    }

  } else {
    //counter-clockwise
    for (let i = 0; i < 3 / 2; i++) {
      for (let j = i; j < len - 1; j++) {

        let temp;
        switch (mainAxis) {
          case 0:

            temp = cubePosition[cubex][i][j][4];

            cubePosition[cubex][i][j][4] = cubePosition[cubex][j][len - 1][4];
            cubePosition[cubex][j][len - 1][4] = cubePosition[cubex][len - 1][len - 1 - j + i][4];
            cubePosition[cubex][len - 1][len - 1 - j + i][4] = cubePosition[cubex][len - 1 - j + i][i][4];
            cubePosition[cubex][len - 1 - j + i][i][4] = temp;

            // cubePosition[cubex][ len - 1 - j + i][i]=temp;
            // cubePosition[cubex][ len - 1]        [len - 1 - j + 1] =cubePosition[cubex][len - 1 - j + i][i];
            // cubePosition[cubex][ j]              [len - 1 ]=cubePosition[cubex][len - 1][len - 1 - j + i];
            // cubePosition[cubex][i][j]   =cubePosition[cubex][j][len - 1];

            break;
          case 1:
            console.log(cubey);
            temp = cubePosition[i][cubey][j][4];


            cubePosition[i][cubey][j][4] = cubePosition[j][cubey][len - 1][4];
            cubePosition[j][cubey][len - 1][4] = cubePosition[len - 1][cubey][len - 1 - j + i][4];
            cubePosition[len - 1][cubey][len - 1 - j + i][4] = cubePosition[len - 1 - j + i][cubey][i][4];
            cubePosition[len - 1 - j + i][cubey][i][4] = temp;

            // cubePosition[cubey][ len - 1 - j + i][i] = temp;                     
            // cubePosition[cubey][ len - 1]        [len - 1 - j + 1]  = cubePosition[len - 1 - j + i][cubey][i]       
            // cubePosition[cubey][ j]              [len - 1 ] = cubePosition[len - 1][cubey][len - 1 - j + i] 
            // cubePosition[i][cubey][j] = cubePosition[j][cubey][len - 1]               

            break;
          case 2:
            temp = cubePosition[i][j][cubez][4];
            cubePosition[i][j][cubez][4] = cubePosition[j][len - 1][cubez][4];
            cubePosition[j][len - 1][cubez][4] = cubePosition[len - 1][len - 1 - j + i][cubez][4];
            cubePosition[len - 1][len - 1 - j + i][cubez][4] = cubePosition[len - 1 - j + i][i][cubez][4];
            cubePosition[len - 1 - j + i][i][cubez][4] = temp;

            break;
        }

    
      }
      len--;
    }
  }


}

// function updatePosition(face){
//   var i, j, k, val;
//   switch (face){
//     case "L":
//       i = 0; j = 2; k = 1; val = -1;
//       break;
//     case "l":
//       i = 0; j = 1; k = 2; val = -1;
//       break;
//     case "R":
//       i = 0; j = 1; k = 2; val = 1;
//       break;
//     case "r":
//       i = 0; j = 2; k = 1; val = 1;
//     break;
//     case "T":
//       i = 1; j = 2; k = 0; val = 1;
//     break;
//     case "t":
//       i = 1; j = 0; k = 2; val = 1;
//     break;
//     case "B":
//       i = 1; j = 0; k = 2; val = -1;
//     break;
//     case "b":
//       i = 1; j = 2; k = 0; val = -1;
//     break;
//     case "E":
//       i = 1; j = 0; k = 2; val = 0;
//     break;
//     case "e":
//       i = 1; j = 2; k = 0; val = 0;
//     break;
//     case "F":
//       i = 2; j = 0; k = 1; val = 1;
//     break;
//     case "f":
//       i = 2; j = 1; k = 0; val = 1;
//     break;
//     case "S":
//       i = 2; j = 0; k = 1; val = 0;
//     break;
//     case "s":
//       i = 2; j = 1; k = 0; val = 0;
//     break;
//     case "K":
//       i = 2; j = 1; k = 0; val = -1;
//     break;
//     case "k":
//       i = 2; j = 0; k = 1; val = -1;
//     break;
//     case "M":
//       i = 0; j = 2; k = 1; val = 0;
//     break;
//     case "m":
//       i = 0; j = 1; k = 2; val = 0;
//     break;
//   }
//   for (x = -1; x < 2; x++) {
//     for (y = -1; y < 2; y++) {
//       for (z = -1; z < 2; z++) {
//         swap(x, y, z, i, j, k, val);
//       }
//     }
//   }
// }

function swap(x, y, z, i, j, k, val) {
  var tmp = [];
  if (cubePosition[x + 1][y + 1][z + 1][i] == val) {
    tmp = cubePosition[x + 1][y + 1][z + 1][j];
    cubePosition[x + 1][y + 1][z + 1][j] = cubePosition[x + 1][y + 1][z + 1][k];
    cubePosition[x + 1][y + 1][z + 1][k] = -tmp;
    tmp = cubePosition[x + 1][y + 1][z + 1][3][k];
    cubePosition[x + 1][y + 1][z + 1][3][k] = negate(cubePosition[x + 1][y + 1][z + 1][3][j]);
    cubePosition[x + 1][y + 1][z + 1][3][j] = tmp;
  }
}


