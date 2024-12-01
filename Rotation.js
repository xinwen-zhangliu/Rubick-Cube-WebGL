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
    turnFace(face);
    currentAngle += rotationAngle;
    if (currentAngle == 90) {
        // Reset parameters
        clearInterval(interval);
        isAnimating = false;
        currentAngle = 0;
        updatePosition(face);
        //   if (check()) {
        //     document.getElementById("status").innerHTML = "Solved!";
        //   } else {
        //     document.getElementById("status").innerHTML = "Not Solved.";
        //   }
    }
}

function turnFace(move) {
    var x,y,z;
    var dir,value;
    var mainAxis;
    var m;
    if ( move = move.toLowerCase()){
        dir = 0;
    }else {
        dir = 1;
    }

    if ( move.toUpperCase() == "L" || move.toUpperCase() == "M" || move.toUpperCase() == "R"){
        mainAxis = 0;
    }else if( move.toUpperCase() == "U" || move.toUpperCase() == "E" || move.toUpperCase() == "D"){
        mainAxis = 1;
    }else {
        mainAxis = 2;
    }

    
    for (x = -1; x < 2; x++) {
      for (y = -1; y < 2; y++) {
        for (z = -1; z < 2; z++) {
          // check if cubie is in the plane of the face being turned
          if (cubePosition[x+1][y+1][z+1][mainAxis] == value) {
            m = getRotationMatrix(x,y,z);
            if (!dir) {
              m = mult(m,rotate(rotationAngle,
                              getRotationAxis(x,y,z)[mainAxis]));
            } else {
              m = mult(m,rotate(rotationAngle,
                              negate(getRotationAxis(x,y,z)[mainAxis])));
            }
            setRotationMatrix(x,y,z,m);
          }
        }
      }
    }
  }