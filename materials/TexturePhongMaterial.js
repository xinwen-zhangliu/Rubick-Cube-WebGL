/**
 * Combines the phong lighting with the ability to add textures to the object.
 */
class TexturePhongMaterial extends Material {
    constructor(gl, image, Ka = [0, 0, 0], Kd = [0, 0, 0], Ks = [0, 0, 0], shininess = 1, opacidad = 1) {
        let vertexShaderSource =
            `#version 300 es
            in vec4 a_position;
            in vec3 a_normal;
        
            // Atributo para obtener la información de las coordenadas de textura
            in vec2 a_texcoord;
        
            // Valor interpolado de las coordenadas de textura, necesario para el shader de fragmentos
            out vec2 v_texcoord;
                
            uniform mat4 u_VM_matrix;
            uniform mat4 u_PVM_matrix;

            out vec3 v_position;
            out vec3 v_normal;
        
            void main() {
                v_texcoord = a_texcoord;
        
                // phong var init
                v_position = vec3( u_VM_matrix * a_position );
                v_normal = vec3( u_VM_matrix * vec4(a_normal, 0) );

                gl_Position = u_PVM_matrix * a_position;
            }`;

        let fragmentShaderSource =
            `#version 300 es
            precision mediump float;
        
            // Valor interpolado de las coordenadas de textura, obtenido desde el shader de vértices
            in vec2 v_texcoord;
        
            // phong ----------------------
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
            // phong ----------------------


            // Referencia a una textura
            uniform sampler2D u_texture;
        
            out vec4 pixelColor;
        
            void main() {
                // phong 
                vec3 L = normalize( u_light.position - v_position );
                vec3 N = normalize( v_normal );

                vec3 ambient_color = ambiental();
                vec3 diffuse_color = difuso(L, N);
                vec3 specular_color = especular(L, N);
                
                vec4 text= texture(u_texture, v_texcoord);
                vec4 phong = vec4(ambient_color + diffuse_color + specular_color, u_material.opacity);
                
                pixelColor = vec4(text.x + phong.x, text.y + phong.y, text.z + phong.z, text.w + phong.w);
            }`;

        // Se llama al constructor de la clase Material
        super(gl, vertexShaderSource, fragmentShaderSource);

        // phong 
        this.Ka = Ka;
        this.Kd = Kd;
        this.Ks = Ks;
        this.shininess = shininess;
        this.opacity = opacidad;

        ////////////////////////////////////////////////////////////////////
        this.texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}