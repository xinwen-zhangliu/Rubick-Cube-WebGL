class FlatMaterial extends Material {
  constructor(gl, color=[1,1,1,1]) {
    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;

    uniform mat4 u_PVM_matrix;

    void main() {
      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    uniform vec4 u_color;

    out vec4 pixelColor;

    void main() {
      pixelColor = u_color;
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.color = color;
  }
}