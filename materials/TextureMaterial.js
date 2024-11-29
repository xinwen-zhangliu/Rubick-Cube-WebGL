class TextureMaterial extends Material {
  constructor(gl, image) {
    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;

    // Atributo para obtener la información de las coordenadas de textura
    in vec2 a_texcoord;

    // Valor interpolado de las coordenadas de textura, necesario para el shader de fragmentos
    out vec2 v_texcoord;

    uniform mat4 u_PVM_matrix;

    void main() {
      v_texcoord = a_texcoord;

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    // Valor interpolado de las coordenadas de textura, obtenido desde el shader de vértices
    in vec2 v_texcoord;

    // Referencia a una textura
    uniform sampler2D u_texture;

    out vec4 pixelColor;

    void main() {
      pixelColor = texture(u_texture, v_texcoord);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    ////////////////////////////////////////////////////////////////////
    // Se crea e inicia una textura utilizando la función de WebGL "gl.createTexture()"
    this.texture = gl.createTexture();

    // WebGL proporciona 8 unidades de textura gl.TEXTURE0 hasta gl.TEXTURE7, es decir, solo podemos usar 8 texturas diferentes en cada material
    // Como solo usamos una textura se asocia a la unidad con indice 0
    gl.activeTexture(gl.TEXTURE0);

    // Igual que con los buffers es necesario activar la textura sobre la cual se van a realizar las siguientes operaciones
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Con la función texImage se toman los píxeles de la imagen y se construye una textura en la memoria de la GPU
    gl.texImage2D(
      // indica el tipo de textura que se esta creando
      gl.TEXTURE_2D,
      // se especifica el nivel de detalle de la textura, lo que nos permite definir varias imágenes dependiendo del nivel de detalle que vamos a presentar, es decir, que dependiendo de que tan lejano o cercano esta el objeto a dibujar, se puede utilizar una imagen de menor o mayor resolución 
      0,
      // el formato que utiliza la imagen que se cargo
      gl.RGBA, 
      // el formato que va a utilizar WebGL para la textura, por lo general tiene el mismo valor de la imagen para evitar perdida de información
      gl.RGBA,
      // el tipo de dato utilizado para representar la textura
      gl.UNSIGNED_BYTE, 
      // la referencia a la imagen
      image
    );

    // se generan las imágenes intermedias para los diferentes niveles de detalle
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);    
    // se libera la textura
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}