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

  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      for (let z = -1; z < 2; z++) {

        if (cubePosition[x + 1][y + 1][z + 1][mainAxis] === value) {

          if (x == 0 && y == 0 && z == 0) {
            continue;
          }

          // we get the rotation matrix so we can apply new rotation
          let m = getRotationMatrix(x, y, z);
          /**
           * Now we get the transformation matrix for rotations that is updated with update()
           * We only need to get the values that represent the x,y,z vectors 
           * example for a neutral x-axis rotation: axis = (1,0,0)
           * 
           * Why we need this?
           * Each cubie is displaced x,y,z coordinates from the center which is at (0,0,0)
           * so whenever we turn a face its relative axises also change, but the rest of the
           * cube is still bound to the starting axises. This causes a problem when we have
           * multiple combined moves and each x,y,z vector of cubies hass a different relative axis
           * upon which they turn. So we store the effects of a rotation in cubePosition[x][y][z][3]
           * and which axises have been modified.
           * 
           */
          let axis = getRotationAxis(x, y, z).slice((mainAxis * 4), (mainAxis * 4) + 3);  // [][][] [3]

          // now we check the direction and apply the rotations
          if (direction) {
            m = multiply(m, rotate(rotationAngle, axis));
          } else {
            m = multiply(m, rotate(rotationAngle,
              negate(axis)));
          }
          // set the new rotation for the cubie
          setRotationMatrix(x, y, z, m);
        }
      }
    }

    // redrawing the window to show the middle frames of rotation
    window.draw();

    if (currentAngle >= 90) {
      clearInterval(interval); // Stop animation
      currentAngle = 0; // Reset for the next rotation
      isAnimating = false;
      update(mainAxis, direction, value);
    }

  }
}

/**
 * Updates the turned cubes with their new coordinates and transformation matrices
 * @param {number} mainAxis the turn axis
 * @param {null} direction the direction 0= cw, 1 = ccw
 * @param {never} value which layer of the axis to turn
 */
function update(mainAxis, direction, value) {

  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      for (let z = -1; z < 2; z++) {
        if (cubePosition[x + 1][y + 1][z + 1][mainAxis] === value) {
          // we ignore the middle cube since it cannot be seen 
          if (x == 0 && y == 0 && z == 0) {
            continue;
          }

          let tx, ty, tz, newcoor;

          // the original coordinates of the cube
          let i = cubePosition[x + 1][y + 1][z + 1][0];
          let j = cubePosition[x + 1][y + 1][z + 1][1];
          let k = cubePosition[x + 1][y + 1][z + 1][2];

          /**
           * If we multiply the coordinate vector with the rotation matrix 
           * we get the new coordinates after the rotation.
           */
          newcoor = multiplyMatrixByVector(createRotationMatrix(mainAxis, direction), [i, j, k]);
          // console.log("previous ",i,j,k);
          // console.log("new", newcoor);

          tx = newcoor[0] - i;
          ty = newcoor[1] - j;
          tz = newcoor[2] - k;

          // we set the new coordinates of the cube after the rotation
          cubePosition[x + 1][y + 1][z + 1][0] = newcoor[0];
          cubePosition[x + 1][y + 1][z + 1][1] = newcoor[1];
          cubePosition[x + 1][y + 1][z + 1][2] = newcoor[2];

          /**
           * We apply the new rotation to the old transformation matrix by multiplying
           * since the transformation matrix is 4x4 we only need the x,y,z vectors 
           * i.e. the top left 3x3
           * the first 3 numbers of last column are the coordinates
           */
          let r = get3x3(cubePosition[x + 1][y + 1][z + 1][3]);
          r = multiply3x3(createRotationMatrix(mainAxis, direction), r);

          // we can set the new values, we do it this way because of the previous reason
          cubePosition[x + 1][y + 1][z + 1][3] =
            [r[0], r[1], r[2], tx * 1.1,
            r[3], r[4], r[5], ty * 1.1,
            r[6], r[7], r[8], tz * 1.1,
              0, 0, 0, 1];

        }
      }
    }
  }

}

/**
 * Returns a rotation matriix for a 90 degree turn based on direction and turn axis
 * @param {number} axis 0 =x, 1 = y, z = 2
 * @param {null} direction 0 clockwise, 1 counterclockwise
 * @returns the rotation matrix 
 */
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
