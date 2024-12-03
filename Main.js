/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

// stores each of the cubes coordinates, rotation and traslation matrixes
// RANGES
// [x 0-2][y 0-2][z 0-2][0-4]
var cubePosition = [
  [[[], [], []], [[], [], []], [[], [], []]],
  [[[], [], []], [[], [], []], [[], [], []]],
  [[[], [], []], [[], [], []], [[], [], []]]
];

// where we're going to store the 27 cube objects
var geometry = [];

/**
 * Returns the rotation axis of the cube
 * @param {number} x coordinate
 * @param {number} y coordinate
 * @param {number} z coordinate
 * @returns the rotation axis
 */
function getRotationAxis(x, y, z) {
  return cubePosition[x + 1][y + 1][z + 1][3];
}

/**
 * returns the rotation matrix of the cube
 * @param {number} x coordinate
 * @param {number} y coordinate
 * @param {number} z coordinate
 * @returns the rotation matrix of the cube
 */
function getRotationMatrix(x, y, z) {
  return cubePosition[x + 1][y + 1][z + 1][4];
}

/**
 * Returns the cube object stored in cubePosition
 * @param {number} x coordinate
 * @param {number} y coordinate
 * @param {number} z coodinate
 * @returns cube at coordinates
 */
function getCube(x, y, z) {
  return cubePosition[x + 1][y + 1][z + 1][5];
}

/**
 * sets a nuew rotation matrix for the cubey
 * @param {number} x coordinate
 * @param {number} y coordinate
 * @param {number} z coordinate
 * @param {Array} m the new rotation matrix
 */
function setRotationMatrix(x, y, z, m) {
  cubePosition[x + 1][y + 1][z + 1][4] = m;
}

window.addEventListener("load", async function (evt) {
  let texCubo = await loadImage("texturas/prisma_rectangular.png");
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  // set variable canvas height/width, as window height/width
  gl.canvas.width = window.innerWidth;
  gl.canvas.height = window.innerHeight;
  if (!gl) throw "WebGL no soportado";

  // the view matrix, of camera, we'll use it in draw()
  let viewMatrix;
  let projectionMatrix = perspective(75 * Math.PI / 180, gl.canvas.width / gl.canvas.height, 1, 2000);

  let light = new LuzPuntual(
    { x: 20, y: 10, z: 5 }, // posición
    [0.2, 0.2, 0.2],    // component ambiental
    [1, 1, 1],          // componente difuso
    [1, 1, 1]           // componente especular
  );


  ////////////////////////////////////////////////////////////
  // Para realizar el render en una textura, es necesario crear varias cosas, entre ellas se necesita un framebuffer y texturas asociadas para almacenar su información

  // Para almacenar la información de color se crea una textura
  let color_texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, color_texture);

  let level = 0;
  let internalFormat = gl.RGBA;
  let texture_width = gl.canvas.width;
  let texture_height = gl.canvas.height;
  let border = 0;
  let format = internalFormat;
  let type = gl.UNSIGNED_BYTE;
  let data = null;

  // Similar a como construimos las texturas a partir de imágenes utilizamos la función texImage2D, pero esta vez con parámetros adicionales para indicar el tamaño y formato de la textura que estamos creando
  gl.texImage2D(
    gl.TEXTURE_2D, level, internalFormat,
    texture_width, texture_height, border,
    format, type, data
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // Un frame buffer es un lugar en memoria en la GPU donde escribe sus resultados el shader de fragmentos y etapas subsecuentes (mezclado y composición); para almacenar esta información se necesitan áreas de memoria las cuales se asignan por medio de texturas
  let myFrameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);

  // La función framebufferTexture2D asocia una textura a un elemento particular del frame buffer, en este caso se asocia con el color (gl.COLOR_ATTACHMENT)
  // En WebGL2 es posible tener hasta 16 texturas asignadas al color, esto con la finalidad de escribir varios a datos durante la misma ejecución de un shader de fragmentos
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color_texture, level);

  // Además de una textura para almacenar los colores, se necesita un componente para almacenar la profundidad, es decir, un z-buffer para el nuevo frame buffer, así que se crea un render buffer para este fin
  let depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texture_width, texture_height);

  // Se asocia al frame buffer activo el nuevo buffer de profundidad
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

  // Se libera la textura activa
  gl.bindTexture(gl.TEXTURE_2D, null);

  // Se libera el frame buffer activo
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  ////////////////////////////////////////////////////////////


  // Se crea un conjunto de materiales planos, para dibujar la geometría en el frame buffer que acabamos de crear, para posteriormente leer la textura de colores y en base al color obtenido determinar cual ha sido el objeto geométrico seleccionado
  let picking_material = new FlatMaterial(gl);
  let picking_colors = [];

  // El número de objetos de la escena, determina la cantidad de materiales, en este caso el indice el objeto en el arreglo geometry determina el color, en este caso solo se utiliza la componente roja para codificar el indice de la geometría lo que da un total de 256 objetos seleccionables, para tener más objetos seleccionables se pueden usar las componentes verde, azul y alfa para la codificación
  console.log("PICKING COLORS ");
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      for (let k = -1; k <= 1; k++) {
        let r = (i + 1) / 2;
        let g = (j + 1) / 2;
        let b = (k + 1) / 2;
        picking_colors.push([r, g, b, 1]);
      }
    }
  }



  // En la variable pixelColor se va a almacenar el color del pixel asociado con la posición del mouse
  let pixelColor = new Uint8Array(4);
  ////////////////////////////////////////////////////////////

  // Se crea un material para dibujar un borde y así indicar cual es el objeto seleccionado
  let borderMaterial = new BorderMaterial(gl, [1, 1, 1, 1]);


  gl.enable(gl.DEPTH_TEST);


  // there variables are used to calculate an initial isometric view of the cube
  var cameraRadius = 20.0;
  var THETA = radians(45);
  var PHI = radians(45);
  var eye = {
    x: cameraRadius * Math.sin(PHI) * Math.sin(THETA),
    y: cameraRadius * Math.cos(PHI),
    z: cameraRadius * Math.sin(PHI) * Math.cos(THETA)
  };

  let camera = new OrbitCamera(
    eye, // posición
    { x: 0, y: 0, z: 0 }, // centro de interés
    { x: 0, y: 1, z: 0 }, // vector hacia arriba
  );


  // There are 27 little cubes in a 3x3x3 Rubik's cube, we set the positions of each cube
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      for (let k = -1; k <= 1; k++) {
        let viewMatrix = translate(i * 1.1, j * 1.1, k * 1.1);
        cubePosition[i + 1][j + 1][k + 1][0] = i;
        cubePosition[i + 1][j + 1][k + 1][1] = j;
        cubePosition[i + 1][j + 1][k + 1][2] = k;

        /* View matrix. */
        cubePosition[i + 1][j + 1][k + 1][3] = viewMatrix;

        /* Rotation Matrix. */
        cubePosition[i + 1][j + 1][k + 1][4] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

        /* Cube. */
        cubePosition[i + 1][j + 1][k + 1][5] = new Cubo(
          gl,
          new TexturePhongMaterial(gl, texCubo, [0, 0, 0], [0.1, 0.1, 0.1], [0.7, 0.7, 0.7], 0.5, 1),
          viewMatrix
        );


      }
    }
  }


  /**
   * Draws the scene
   */
  function draw() {


    viewMatrix = camera.getMatrix();

    // Se activa el frame buffer creado, para realizar el render en él
    gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);
    gl.bindTexture(gl.TEXTURE_2D, color_texture);
    gl.viewport(0, 0, texture_width, texture_height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // we'll store the updated views for each cube
    let updatedViewMatrix = [];



    /* Dibujar los cubos que detectarán. */
    for (let i = 0; i < picking_colors.length; i++) {
      picking_material.color = picking_colors[i];
      const r = (picking_colors[i][0] * 2);
      const g = (picking_colors[i][1] * 2);
      const b = (picking_colors[i][2] * 2);

      cubePosition[r][g][b][5].drawMaterial(gl,
        picking_material,
        projectionMatrix,
        multiply(viewMatrix, translate((r - 1) * 1.1, (g - 1) * 1.1, (b - 1) * 1.1)),
        light);
    }

    // Se dibujan los objetos con el material de selección
    // for (let i = 0; i < geometry.length; i++) {
    //   // Al material plano de selección se le asocia cual es su color de la lista de colores, hay que recordar que cada objeto en el arreglo geometry tiene asociado un único color en el arreglo picking_colors
    //   picking_material.color = picking_colors[i];
    //   // Se utiliza la función drawMaterial para dibujar la geometría con el material de selección
    //   geometry[i].drawMaterial(gl, picking_material, projectionMatrix, staticView[i], light);
    // }

    // Se libera la textura
    gl.bindTexture(gl.TEXTURE_2D, null);


    // Al asignar el frame buffer activo como null, se utiliza el frame buffer por defecto, es decir, el frame buffer de la tarjeta de video el que se dibuja en pantalla
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // for (let i = 0; i < picking_colors.length; i++) {
    //   const r = (picking_colors[i][0] * 2);
    //   const g = (picking_colors[i][1] * 2);
    //   const b = (picking_colors[i][2] * 2);

    //   let cube = cubePosition[r][g][b][5];
    //   var tmp = viewMatrix;
    //   //staticView.push(multiply(viewMatrix, cubePosition[i + 1][j + 1][k + 1][3]));
    //   viewMatrix = multiply(viewMatrix, getRotationMatrix(r - 1, g - 1, b - 1));
    //   viewMatrix = multiply(viewMatrix, translate(i * 1.1, j * 1.1, k * 1.1));
    //   cube.draw(gl, projectionMatrix, viewMatrix, light);


    //   // Se dibuja el borde del objeto seleccionado
    //   if (cube.border) {
    //     gl.enable(gl.CULL_FACE);
    //     gl.cullFace(gl.FRONT);
    //     cube.drawMaterial(gl, borderMaterial, projectionMatrix, viewMatrix, light);
    //     gl.disable(gl.CULL_FACE);
    //   }
    //   viewMatrix = tmp;
    // }

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        for (let k = -1; k <= 1; k++) {
          let cube = cubePosition[i + 1][j + 1][k + 1][5];
          var tmp = viewMatrix;
          //staticView.push(multiply(viewMatrix, cubePosition[i + 1][j + 1][k + 1][3])); 
          // let coor = cubePosition[i + 1][j + 1][k + 1];
          viewMatrix = multiply(viewMatrix, getRotationMatrix(i, j, k));
          viewMatrix = multiply(viewMatrix, translate(i * 1.1, j * 1.1, k * 1.1));
          cube.draw(gl, projectionMatrix, viewMatrix, light);
          // Se dibuja el borde del objeto seleccionado 
          if (cube.border) {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.FRONT);
            cube.drawMaterial(gl, borderMaterial, projectionMatrix, viewMatrix, light);
            gl.disable(gl.CULL_FACE);
          }
          viewMatrix = tmp;
        }
      }
    }
  }

  // setting global access to draw the rotations
  window.draw = draw;
  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);
  requestAnimFrame(draw); 

  //////////////////////////////////////////////////
  // Se agrega el control para convertir la posición del mouse a una posición en pantalla y obtener el color de la textura asociada al frame buffer no visible

  // La posición del mouse
  let mouse_position;
  // El indice del objeto seleccionado
  let last_picked = [];


  // El manejador de eventos para detectar donde se pulso el botón del ratón
  gl.canvas.addEventListener("mousedown", (evt) => {


    // Se obtiene la posición del ratón dentro del canvas
    mouse_position = getMousePositionInElement(evt, gl.canvas);

    // Para obtener el color en la textura en la posición del ratón, hay que normalizar la posición, recordando que las coordenadas de textura van de 0 a 1
    mouse_position.x = (mouse_position.x / gl.canvas.width) * texture_width;
    // Hay que recordar que las coordenada y en el canvas aumenta positivamente hacia abajo, mientras que en las coordenadas de textura aumenta positivamente hacia arriba
    mouse_position.y = ((gl.canvas.height - mouse_position.y) / gl.canvas.height) * texture_height;

    // Se activa el frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);

    // Y la textura para acceder a su información
    gl.bindTexture(gl.TEXTURE_2D, color_texture);

    // La función readPixels permite leer información de la textura activa y guardar esa información
    //  en el último parámetro
    gl.readPixels(mouse_position.x, mouse_position.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelColor);


    console.log("pixelColor[0]: " + pixelColor[0]);
    console.log("pixelColor[1]: " + pixelColor[1]);
    console.log("pixelColor[2]: " + pixelColor[2]);


    // Normalizar y ajustar a las coordenadas de cubePosition
    let r = Math.ceil(pixelColor[0] / 256 * 2); // mapea [0-255] a [0, 2]
    let g = Math.ceil(pixelColor[1] / 256 * 2); // mapea [0-255] a [0, 2]
    let b = Math.ceil(pixelColor[2] / 256 * 2); // mapea [0-255] a [0, 2]

    console.log("");
    console.log("R: " + r);
    console.log("G: " + g);
    console.log("B: " + b);


    // Se libera la textura
    gl.bindTexture(gl.TEXTURE_2D, null);
    // Se libera el frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);



    // Si ya existe un elemento seleccionado se le quita el atributo del borde
    if (last_picked.length > 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          for (let k = -1; k <= 1; k++) {
            cubePosition[i + 1][j + 1][k + 1][5].border = false;
          }
        }
      }

    }

    // Los colores en el arreglo picking_colors se construyen con la componente alfa igual a 1, mientras que el color del fondo tienen un alfa de 0
    if (pixelColor[3] !== 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          for (let k = -1; k <= 1; k++) {
            cubePosition[i + 1][j + 1][k + 1][5].border = false;
          }
        }
      }
      last_picked = [r, g, b];
      console.log("Last picked: " + last_picked);
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          for (let k = -1; k <= 1; k++) {
            let x = cubePosition[i + 1][j + 1][k + 1][0];
            let y = cubePosition[i + 1][j + 1][k + 1][1];
            let z = cubePosition[i + 1][j + 1][k + 1][2];
            if (x == (r - 1) && y == (g - 1) && z == (b - 1)) {
              console.log("COORDENADAS", x, y, z);
              cubePosition[i + 1][j + 1][k + 1][5].border = true;
            }

          }
        }
      }
     


    }
    // Se dio click en el fondo
    else {
      last_picked = [];
    }
    // Una vez determinado si se selecciono o no un objeto se redibuja la escena
    draw();
  });


  document.addEventListener("keydown", (evt) => {


    let key = evt.key;

    let mainAxis, direction = 0;
    let value = -1;

    /**
     * Assigning the axis and irection according the key pressed
     */
    if (key === 'a') {
      mainAxis = 0;
    } else if (key === 's') {
      mainAxis = 1;
    } else if (key === 'd') {
      mainAxis = 2;
    } else if (key === 'A') {
      mainAxis = 0;
      direction = 1;
    } else if (key === 'S') {
      mainAxis = 1;
      direction = 1;
    } else if (key === 'D') {
      mainAxis = 2;
      direction = 1;
    }


    if (pixelColor[3] !== 0 && isAnimating == false) {
      console.log(last_picked);
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          for (let k = -1; k <= 1; k++) {

            if (
              cubePosition[i + 1][j + 1][k + 1][0] == last_picked[0] - 1 &&
              cubePosition[i + 1][j + 1][k + 1][1] == last_picked[1] - 1 &&
              cubePosition[i + 1][j + 1][k + 1][2] == last_picked[2] - 1) {

              if (mainAxis == 0) {
                value = last_picked[0];
              } else if (mainAxis == 1) {
                value = last_picked[1]
              } else {
                value = last_picked[2];
              }
              animationQueue.push({ value: (value - 1), mainAxis, direction });
            }
          }
        }
      }
    }
    if (animationQueue.length != 0 && !isAnimating) {
      animate(animationQueue.shift());
      isAnimating = true;
    }
  });


});