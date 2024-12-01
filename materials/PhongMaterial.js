class PhongMaterial extends Material {
  constructor(gl, Ka=[0,0,0], Kd=[0,0,0], Ks=[0,0,0], shininess=1, opacidad=1) {
    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;

    uniform mat4 u_VM_matrix;
    uniform mat4 u_PVM_matrix;

    out vec3 v_position;
    out vec3 v_normal;

    void main() {
      v_position = vec3( u_VM_matrix * a_position );
      v_normal = vec3( u_VM_matrix * vec4(a_normal, 0) );

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    in vec3 v_position;
    in vec3 v_normal;

    // Toda la información de la luz
    struct Light {
      vec3 position;
      vec3 La;
      vec3 Ld;
      vec3 Ls;
    };

    // Toda la información del material
    struct Material {
      vec3 Ka;
      vec3 Kd;
      vec3 Ks;
      float shininess;
      float opacity;
    };

    // La luz se vuelve una instancia de la estructura Light
    uniform Light u_light;

    // El material se vuelve una instancia de la estructura Material
    uniform Material u_material;

    out vec4 pixelColor;

    // Función que devuelve el componente ambiental
    vec3 ambiental() {
      return u_material.Ka * u_light.La;
    }

    // Función que devuelve el componente difuso
    vec3 difuso(vec3 L, vec3 N) {
      return u_material.Kd * u_light.Ld * max(dot(N, L), 0.0);
    }

    // Función que devuelve el componente especular
    vec3 especular(vec3 L, vec3 N) {
      vec3 R = normalize( 2.0 * N * (dot(N, L)) - L );
      vec3 V = normalize( -v_position );

      return u_material.Ks * u_light.Ls * pow(max(dot(R, V), 0.0), u_material.shininess);
    }

    void main() {
      vec3 L = normalize( u_light.position - v_position );
      vec3 N = normalize( v_normal );

      vec3 ambient_color = ambiental();
      vec3 diffuse_color = difuso(L, N);
      vec3 specular_color = especular(L, N);

      pixelColor = vec4(ambient_color + diffuse_color + specular_color, u_material.opacity);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.Ka = Ka;
    this.Kd = Kd;
    this.Ks = Ks;
    this.shininess = shininess;
    this.opacity = opacidad;
  }
}