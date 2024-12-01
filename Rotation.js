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

var LRotate = ["L","F","R","K","L","F","R","K"];
var MRotate = ["M","S","m","s","M","S","m","s"];
var RRotate = ["R","K","L","F","R","K","L","F"];
var TRotate = ["B","B","B","B","T","T","T","T"];
var ERotate = ["e","e","e","e","E","E","E","E"];
var BRotate = ["T","T","T","T","B","B","B","B"];
var FRotate = ["K","L","F","R","F","R","K","L"];
var SRotate = ["s","M","S","m","S","m","s","M"];
var KRotate = ["F","R","K","L","K","L","F","R"];
var lRotate = ["l","f","r","k","l","f","r","k"];
var mRotate = ["m","s","M","S","m","s","M","S"];
var rRotate = ["r","k","l","f","r","k","l","f"];
var tRotate = ["b","b","b","b","t","t","t","t"];
var eRotate = ["E","E","E","E","e","e","e","e"];
var bRotate = ["t","t","t","t","b","b","b","b"];
var fRotate = ["k","l","f","r","f","r","k","l"];
var sRotate = ["S","m","s","M","s","M","S","m"];
var kRotate = ["f","r","k","l","k","l","f","r"];

function correctFace(face){
    var newFace;
    var theta = (THETA/ Math.PI * 180.0)%360;
    var phi = (PHI/ Math.PI * 180.0)%360;
    var i;
    if ((phi >= -180 && phi < 0) || (phi >= 180 && phi < 360)){
      if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315){
        i = 0;
      } else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)){
        i = 1;
      } else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)){
        i = 2;
      } else if ((theta >= -135 && theta < -45) || (theta >= 215 && theta < 315)){
        i = 3;
      }
    } else{
      if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315){
        i = 4;
      } else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)){
        i = 5;
      } else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)){
        i = 6;
      } else if ((theta >= -135 && theta < -45) || (theta >= 215 && theta < 315)){
        i = 7;;
      }
    }
    switch(face){
      case "L":
        newFace = LRotate[i];;
      break;
      case "l":
        newFace = lRotate[i];;
      break;
      case "M":
        newFace = MRotate[i];;
      break;
      case "m":
        newFace = mRotate[i];;
      break;
      case "R":
        newFace = RRotate[i];;
      break;
      case "r":
        newFace = rRotate[i];;
      break;
      case "T":
        newFace = TRotate[i];;
      break;
      case "t":
        newFace = tRotate[i];;
      break;
      case "B":
        newFace = BRotate[i];;
      break;
      case "b":
        newFace = bRotate[i];;
      break;
      case "E":
        newFace = ERotate[i];;
      break;
      case "e":
        newFace = eRotate[i];;
      break;
      case "F":
        newFace = FRotate[i];;
      break;
      case "f":
        newFace = fRotate[i];;
      break;
      case "K":
        newFace = KRotate[i];;
      break;
      case "k":
        newFace = kRotate[i];;
      break;
      case "S":
        newFace = SRotate[i];;
      break;
      case "s":
        newFace = sRotate[i];;
      break;
    }
    return newFace;
  }