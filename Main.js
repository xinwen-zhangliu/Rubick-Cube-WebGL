
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

  var interval;
  function animate(action){
    interval = setInterval(function(){rotation(action)}, animationTimer);
  }

  //-------------------
  

  let light = new LuzPuntual(
    { x: 0, y: 5, z: 5 }, // posición
    [ 0.2, 0.2, 0.2 ],    // component ambiental
    [ 1, 1, 1 ],          // componente difuso
    [ 1, 1, 1 ]           // componente especular
  );

  ////////////////////////////////////////////////////////////
  // Para realizar el render en una textura, es necesario crear varias cosas, entre ellas se necesita un framebuffer y texturas asociadas para almacenar su información

  // Para almacenar la información de color se crea una textura
  let color_texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, color_texture);
  
  let level = 0;
  let internalFormat = gl.RGBA;
  let texture_width  = gl.canvas.width;
  let texture_height = gl.canvas.height;
  let border = 0;
  let format = internalFormat;
  let type = gl.UNSIGNED_BYTE;
  let data = null;
  
  // Similar a como construimos las texturas a partir de imágenes utilizamos la función texImage2D, pero esta vez con parámetros adicionales para
  // indicar el tamaño y formato de la textura que estamos creando
  gl.texImage2D(
    gl.TEXTURE_2D, level, internalFormat,
    texture_width, texture_height, border,
    format, type, data
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // Un frame buffer es un lugar en memoria en la GPU donde escribe sus resultados el shader de fragmentos y etapas subsecuentes (mezclado y composición); 
  // para almacenar esta información se necesitan áreas de memoria las cuales se asignan por medio de texturas
  let myFrameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);

  // La función framebufferTexture2D asocia una textura a un elemento particular del frame buffer, en este caso se asocia con el color (gl.COLOR_ATTACHMENT)
  // En WebGL2 es posible tener hasta 16 texturas asignadas al color, esto con la finalidad de escribir varios a datos durante la misma ejecución de un shader de fragmentos
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color_texture, level);

  // Además de una textura para almacenar los colores, se necesita un componente para almacenar la profundidad, es decir, un z-buffer para el nuevo frame buffer, 
  // así que se crea un render buffer para este fin
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

  // Se crea un conjunto de materiales planos, para dibujar la geometría en el frame buffer que acabamos de crear, para posteriormente leer la textura de colores y 
  // en base al color obtenido determinar cual ha sido el objeto geométrico seleccionado
  let picking_material = new FlatMaterial(gl);
  let picking_colors = [];

  // El número de objetos de la escena, determina la cantidad de materiales, en este caso el indice el objeto en el arreglo geometry determina el color, 
  // en este caso solo se utiliza la componente roja para codificar el indice de la geometría lo que da un total de 256 objetos seleccionables, 
  // para tener más objetos seleccionables se pueden usar las componentes verde, azul y alfa para la codificación
  for (let i=0; i<27; i++) {
    picking_colors.push([i/256, 0, 0, 1]);
  }
  // En la variable pixelColor se va a almacenar el color del pixel asociado con la posición del mouse
  let pixelColor = new Uint8Array(4);
   // Se crea un material para dibujar un borde y así indicar cual es el objeto seleccionado
   let borderMaterial = new BorderMaterial(gl, [1,1,1,1]);


   gl.enable(gl.DEPTH_TEST);
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

    
    light.update(viewMatrix);

    // Se activa el frame buffer creado, para realizar el render en él
    gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);
    gl.bindTexture(gl.TEXTURE_2D, color_texture);
    gl.viewport(0, 0, texture_width, texture_height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Se dibujan los objetos con el material de selección
    for (let i=0; i<geometry.length; i++) {
      // Al material plano de selección se le asocia cual es su color de la lista de colores, hay que recordar que cada objeto en el arreglo geometry 
      // tiene asociado un único color en el arreglo picking_colors
      picking_material.color = picking_colors[i];

      // Se utiliza la función drawMaterial para dibujar la geometría con el material de selección
      geometry[i].drawMaterial(gl, picking_material, projectionMatrix, viewMatrix, light);
    }

    // Se libera la textura
    gl.bindTexture(gl.TEXTURE_2D, null);


    // Al asignar el frame buffer activo como null, se utiliza el frame buffer por defecto, es decir, el frame buffer de la tarjeta de video el que se dibuja en pantalla
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


   
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
      // Se dibuja el borde del objeto seleccionado
      if (geometry[i].border) {
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);
        geometry[i].drawMaterial(gl, borderMaterial, projectionMatrix, viewMatrix, light);
        gl.disable(gl.CULL_FACE);
      }
    }
    
  }
  render();

  // -------------------------------------------------


  camera.registerMouseEvents(gl.canvas, render);
});


