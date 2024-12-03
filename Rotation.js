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


/**
 * direction : 0 
 * direction : 1
 */

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
    rotation(action.value, action.mainAxis, action.direction);
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
function rotation(value, mainAxis, direction) {

  currentAngle += rotationAngle;
  //let value = Math.round(cube.transform[(mainAxis * 4) + 3]);
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      for (let z = -1; z < 2; z++) {
        
        if (cubePosition[x + 1][y + 1][z + 1][mainAxis] === value) {
          
          if (x == 0 && y == 0 && z == 0) {
            continue;
          }
          let m = getRotationMatrix(x,y,z);
          console.log(getRotationAxis(x,y,z));
          let axis = getRotationAxis(x,y,z).slice((mainAxis*4), (mainAxis*4)+3);
          console.log("AXIS", axis);


          if (direction) {
            m = multiply(m,rotate(rotationAngle, axis)); // [][][] [3]
          } else {
            m = multiply(m,rotate(rotationAngle,
                            negate(axis)));
          }
          setRotationMatrix(x,y,z,m);

        }
      }
    }


    window.draw();

    if (currentAngle >= 90) {
      clearInterval(interval); // Stop animation
      currentAngle = 0; // Reset for the next rotation
      isAnimating = false;
      update(mainAxis, direction, value);

      
    }

  }
}

function update(mainAxis, direction, value) {

  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      for (let z = -1; z < 2; z++) {
        if (cubePosition[x + 1][y + 1][z + 1][mainAxis] === value) {
          if (x == 0 && y == 0 && z == 0) {
            continue;
          }
          
          let tx, ty, tz, ogx, ogy, newcoor;

          let i = cubePosition[x + 1][y + 1][z + 1][0];
          let j = cubePosition[x + 1][y + 1][z + 1][1];
          let k = cubePosition[x + 1][y + 1][z + 1][2];
          
          newcoor  = multiplyMatrixByVector(createRotationMatrix(mainAxis, direction), [i,j,k]);
          console.log("previous ",i,j,k);
          console.log("new", newcoor);
          
          tx = newcoor[0] - i;
          ty = newcoor[1] - j;
          tz = newcoor[2] - k;

          cubePosition[x + 1][y + 1][z + 1][0]  = newcoor[0];
          cubePosition[x + 1][y + 1][z + 1][1]  = newcoor[1];
          cubePosition[x + 1][y + 1][z + 1][2]  = newcoor[2];

          let r = get3x3(cubePosition[x + 1][y + 1][z + 1][3]);
          r = multiply3x3(createRotationMatrix(mainAxis, direction), r);

          cubePosition[x + 1][y + 1][z + 1][3] = //translate(1.1*newcoor[0],1.1*newcoor[1],1.1*newcoor[2]);
          [r[0], r[1], r[2], tx*1.1,//i*1.1,// //// // 1.1*newcoor[0],
          r[3], r[4], r[5],  ty*1.1,//j*1.1,// //// // 1.1*newcoor[1],
          r[6], r[7], r[8],  tz*1.1,//k*1.1,// //// // 1.1*newcoor[2],
          0,0,0,1];
         
        }
      }
    }
  }

}

function setRotation(axis, i, j, k){
  let x =  cubePosition[i+1][j+1][k+1][4][(axis*4)];
  let y =  cubePosition[i+1][j+1][k+1][4][(axis*4)+1];
  let z =  cubePosition[i+1][j+1][k+1][4][(axis*4)+2];
  let w =  cubePosition[i+1][j+1][k+1][4][(axis*4)+3];


  let newMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  newMatrix[(axis*4)] = x;
  newMatrix[(axis*4)+1] = y;
  newMatrix[(axis*4)+2] = z;
  newMatrix[(axis*4)+3] = w;
  
}

function rotateCoordinates(x, y, direction) {
  if (!direction) {// clockwise
    return { x: y, y: 2 - x };
  }
  return { x: 2 - y, y: x };
}






function createRotationMatrix(axis, direction = 0) {
  let matrix;

  switch (axis) {
    case 0:
      matrix = direction == 0
        ? [
          1, 0, 0,
          0, 0, 1,
          0, -1, 0
        ]
        : [
          1, 0, 0,
          0, 0, -1,
          0, 1, 0
        ];
      break;
    case 1:
      matrix = direction == 0
        ? [
          0, 0, -1,
          0, 1, 0,
          1, 0, 0
        ]
        : [
          0, 0, 1,
          0, 1, 0,
          -1, 0, 0
        ];
      break;
    case 2:
      matrix = direction == 0
        ? [
          0, 1, 0,
          -1, 0, 0,
          0, 0, 1
        ]
        : [
          0, -1, 0,
          1, 0, 0,
          0, 0, 1
        ];
      break;
    default:
      throw new Error("Invalid axis! Use 'X', 'Y', or 'Z'.");
  }

  return matrix;
}
