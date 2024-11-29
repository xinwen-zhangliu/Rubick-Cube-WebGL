// Es importante el async
window.addEventListener("load", async function(evt) {
  let canvas = document.getElementById("the_canvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) throw "WebGL no soportado";

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let texCilindro = await loadImage("texturas/cilindro.png");
  let texCono = await loadImage("texturas/cono.png");
  let texDodecaedro = await loadImage("texturas/dodecaedro.png");
  let texEsfera = await loadImage("texturas/esfera.png");
  let texIcosaedro = await loadImage("texturas/icosaedro.png");
  let texOctaedro = await loadImage("texturas/octaedro.png");
  let texPrismaRectangular = await loadImage("texturas/prisma_rectangular.png");
  let texTetraedro = await loadImage("texturas/tetraedro.png");
  let texToroide = await loadImage("texturas/toroide.png");


  
  

 
  
  let projectionMatrix = Matrix4.perspective(75*Math.PI/180, canvas.width/canvas.height, 1, 2000);

  let lightPosition = new Vector4(5,5,5,1);

  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);

 
  //-----------------------------

  var eye = new Vector3(0.0, 3.0, 3.0);
  var at = new Vector3(0.0, 0.0, 1.0);
  var up = new Vector3(0.0, 1.0, 0.0);


  function radians(degrees) {
    return degrees * Math.PI / 180.0;
  }
  var cubePosition = [
    [[[], [], []], [[], [], []], [[], [], []]],
    [[[], [], []], [[], [], []], [[], [], []]],
    [[[], [], []], [[], [], []], [[], [], []]]
  ];

  function initPosition() {
    for (i = -1; i < 2; i++) {
      for (j = -1; j < 2; j++) {
        for (k = -1; k < 2; k++) {
          cubePosition[i + 1][j + 1][k + 1][0] = i; // x
          cubePosition[i + 1][j + 1][k + 1][1] = j; // y
          cubePosition[i + 1][j + 1][k + 1][2] = k; // z
          cubePosition[i + 1][j + 1][k + 1][3] = [new Vector3(-1, 0, 0),
          new Vector3(0, -1, 0),
          new Vector3(0, 0, -1)]; // ref_axises
          cubePosition[i + 1][j + 1][k + 1][4] = new Matrix4(); // rotaton matrix
        }
      }
    }
  }


  initPosition();
  function getRotationMatrix(x, y, z) {
    return cubePosition[x + 1][y + 1][z + 1][4];
  }

  var THETA = radians(45);
  var PHI = radians(45);
  
  
  var fovy = 45.0;  // Angle (in degrees) of the field-of-view in the Y-direction
  var aspect = 1.0; // Aspect ratio of the viewport
  var near = 0.3;
  var far = 1000;
  var THETA = radians(45);
  var PHI = radians(45);
  var cameraRadius = 10.0;
  let camera = new Camera(
    eye, at, up
  );
  // let camera = new Camera(
  //   eye, at , up
  //  );
  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let viewMatrix = camera.getMatrix();
    let trans_lightPosition = viewMatrix.multiplyVector(lightPosition);
    // Set the camera position at each render
    
      
    // using the perspective function,
    // which returns a 4x4 matrix
    //projMatrix = Matrix4.perspective(fovy, aspect, near, far);
    //mvMatrix = Matrix4.lookAt(eye, at, up);
    mvMatrix = camera.getMatrix();
    
    var x, y, z;
    for (x = -1; x <= 1; x++) {
      for (y = -1; y <= 1; y++) {
        for (z = -1; z <= 1; z++) {
          if (x != 0 || y != 0 || z != 0) { // Any non-center cube
            var tmp = mvMatrix;
            mvMatrix = Matrix4.multiply(mvMatrix, getRotationMatrix(x, y, z));
            mvMatrix = Matrix4.multiply(mvMatrix, Matrix4.translate(new Vector3(x * 2.1, y * 2.1, z * 2.1)));
            console.log(mvMatrix);
            new PrismaRectangular(
              gl,
              2, 2, 2,
              new TextureMaterial(gl, texPrismaRectangular),
              mvMatrix
            ).draw(
              gl,
              projectionMatrix,
              viewMatrix,
              {
                pos: [
                  trans_lightPosition.x,
                  trans_lightPosition.y,
                  trans_lightPosition.z
                ],
                ambient: [0.2, 0.2, 0.2],
                diffuse: [1, 1, 1],
                especular: [1, 1, 1]
              }

            );
            mvMatrix = tmp;
          }else{
            mvMatrix = Matrix4.multiply(mvMatrix, getRotationMatrix(x, y, z));
            mvMatrix = Matrix4.multiply(mvMatrix, Matrix4.translate(new Vector3(x * 2.1, y * 2.1, z * 2.1)));
            console.log("Here");
            console.log(new Vector3(x * 2.1, y * 2.1, z * 2.1));
          }
        }
      }
    }

  }
  render();

  // -------------------------------------------------

  
  camera.registerMouseEvents(gl.canvas, render);
});

function getMousePositionInElement(evt, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
