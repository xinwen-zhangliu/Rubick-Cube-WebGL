
// Es importante el async
window.addEventListener("load", async function (evt) {
  let canvas = document.getElementById("the_canvas");
  const gl = canvas.getContext("webgl2");
  // set variable canvas height, as window height 
  gl.canvas.width  = window.innerWidth;
  gl.canvas.height = window.innerHeight;

  if (!gl) throw "WebGL no soportado";

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let texPrismaRectangular = await loadImage("texturas/prisma_rectangular.png");

  let projectionMatrix = Matrix4.perspective(75 * Math.PI / 180, canvas.width / canvas.height, 1, 2000);
  let lightPosition = new Vector4(5, 5, 5, 1);

  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);


  //-----------------------------
  
  var cameraRadius = 20.0;
  var THETA = radians(45);
  var PHI = radians(45);                                
  //var eye = new Vector3(5.0, 15.0, 40.0);
  var eye = new Vector3(cameraRadius*Math.sin(PHI)*Math.sin(THETA),
  cameraRadius*Math.cos(PHI),
  cameraRadius*Math.sin(PHI)*Math.cos(THETA));
  var at = new Vector3(0.0, 0.0, 1.0);
  var up = new Vector3(0.0, 1.0, 0.0);
  let camera = new Camera(eye, at, up);

  var cubePosition = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      for (let k = -1; k <= 1; k++) {
        let viewMatrix = Matrix4.translate(new Vector3(i * 1.1, j * 1.1, k * 1.1));
        cubePosition.push({
          x: i,
          y: j,
          z: k,
          viewMatrix: viewMatrix,
          rotationMatrix: new Matrix4()
        });
      }
    }
  }

  let geometry = [];
  for (let i = 0; i < cubePosition.length; i++) {
    geometry.push(new PrismaRectangular(
      gl,
      2, 2, 2,
      new TextureMaterial(gl, texPrismaRectangular),
      cubePosition[i].viewMatrix
    ));
  }

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let viewMatrix = camera.getMatrix();
    let trans_lightPosition = viewMatrix.multiplyVector(lightPosition);

    for (let i = 0; i < cubePosition.length; i++) {
      let { x, y, z, viewMatrix: positionMatrix, rotationMatrix } = cubePosition[i];

      // Update rotation and translation for each cube in the grid
      let updatedViewMatrix = Matrix4.multiply(viewMatrix, rotationMatrix);
      updatedViewMatrix = Matrix4.multiply(updatedViewMatrix, positionMatrix);

      // Draw the geometry (cube) with the updated transformation matrix
      geometry[i].draw(
        gl,
        projectionMatrix,
        updatedViewMatrix,
        {
          pos: [
            trans_lightPosition.x,
            trans_lightPosition.y,
            trans_lightPosition.z
          ],
          ambient: [0.2, 0.2, 0.2],
          diffuse: [1, 1, 1],
          specular: [1, 1, 1]
        }
      );
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
