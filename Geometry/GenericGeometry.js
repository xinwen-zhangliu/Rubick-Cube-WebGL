class GenericGeometry {
  constructor(gl, material, transform) {
    this.material = material;
    this.transform = transform;
  }

  /**
   */
  init(gl) {
    this.vertices = this.getVertices();

    if (this.getFaces) {
      this.faces = this.getFaces();
      this.createSmoothVAO(gl);
    }

    this.createFlatVAO(gl);
  }

  /**
   */
  createSmoothVAO(gl) {
    let normals = this.getSmoothNormals(this.vertices, this.faces);
    
    let uv;
    if (this.getUVCoordinates) {
      uv = this.getUVCoordinates(this.vertices);
    }

    this.smoothVAO = gl.createVertexArray();
    gl.bindVertexArray(this.smoothVAO);

    //////////////////////////////////////////////////
    let positionBuffer = gl.createBuffer();
    this.smooth_positionBuffer = positionBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_position"));
    gl.vertexAttribPointer(this.material.getAttribute("a_position"), 3, gl.FLOAT, false, 0, 0);

    //////////////////////////////////////////////////
    if (this.material.getAttribute("a_normal") != undefined) {
      let normalBuffer = gl.createBuffer();
      this.smooth_normalBuffer = normalBuffer;
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.material.getAttribute("a_normal"));
      gl.vertexAttribPointer(this.material.getAttribute("a_normal"), 3, gl.FLOAT, false, 0, 0);
    }

    //////////////////////////////////////////////////
    if ((uv != undefined) && (this.material.getAttribute("a_texcoord") != undefined)) {
      let uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.material.getAttribute("a_texcoord"));
      gl.vertexAttribPointer(this.material.getAttribute("a_texcoord"), 2, gl.FLOAT, false, 0, 0);
    }

    //////////////////////////////////////////////////
    let indexBuffer = gl.createBuffer();
    this.smooth_indexBuffer = indexBuffer;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    this.num_smooth_elements = this.faces.length;
  }

  /**
   */
  createFlatVAO(gl) {
    let vertices;
    if (this.faces) {
      vertices = this.getFlatVertices(this.vertices, this.faces);
    }
    else {
      vertices = this.vertices;
    }

    let normals = this.getFlatNormals(vertices);

    let uv;
    if (this.getUVCoordinates) {
      uv = this.getUVCoordinates(vertices, true);
    }

    this.flatVAO = gl.createVertexArray();
    gl.bindVertexArray(this.flatVAO);


    let positionBuffer = gl.createBuffer();
    this.flat_positionBuffer = positionBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_position"));
    gl.vertexAttribPointer(this.material.getAttribute("a_position"), 3, gl.FLOAT, false, 0, 0);


    //////////////////////////////////////////////////
    if (this.material.getAttribute("a_normal") != undefined) {
      let normalBuffer = gl.createBuffer();
      this.flat_normalBuffer = normalBuffer;
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.material.getAttribute("a_normal"));
      gl.vertexAttribPointer(this.material.getAttribute("a_normal"), 3, gl.FLOAT, false, 0, 0);
    }
    //////////////////////////////////////////////////

    //////////////////////////////////////////////////
    // Si el atributo tiene el valor de -1 significa que el programa (shaders) no cuenta con dicho atributo
    if ((uv != undefined) && (this.material.getAttribute("a_texcoord") != undefined)) {
      let uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.material.getAttribute("a_texcoord"));
      gl.vertexAttribPointer(this.material.getAttribute("a_texcoord"), 2, gl.FLOAT, false, 0, 0);
    }
    //////////////////////////////////////////////////


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    this.num_flat_elements = vertices.length/3;
  }


  /**
   */
  draw(gl, projectionMatrix, viewMatrix, light) {
    gl.useProgram(this.material.program);

    let viewModelMatrix = multiply(viewMatrix, this.transform);
    let projectionViewModelMatrix = multiply(projectionMatrix, viewModelMatrix);

    // u_VM_matrix
    if (this.material.getUniform("u_VM_matrix") != undefined) {
      gl.uniformMatrix4fv(this.material.getUniform("u_VM_matrix"), true, viewModelMatrix);
    }
    // u_PVM_matrix
    if (this.material.getUniform("u_PVM_matrix") != undefined) {
      gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix);
    }

    ////////////////////////////////////////////////////////////
    // Componentes de la luz
    ////////////////////////////////////////////////////////////
    // u_light.position
    if (this.material.getUniform("u_light.position") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_light.position"), light.getPosition());
    }
    // u_light.La
    if (this.material.getUniform("u_light.La") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_light.La"), light.ambient);
    }
    // u_light.Ld
    if (this.material.getUniform("u_light.Ld") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_light.Ld"), light.diffuse);
    }
    // u_light.Ls
    if (this.material.getUniform("u_light.Ls") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_light.Ls"), light.especular);
    }
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // Componentes del material
    ////////////////////////////////////////////////////////////
    // u_material.Ka
    if (this.material.getUniform("u_material.Ka") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_material.Ka"), this.material.Ka);
    }
    // u_material.Kd
    if (this.material.getUniform("u_material.Kd") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_material.Kd"), this.material.Kd);
    }
    // u_material.Ks
    if (this.material.getUniform("u_material.Ks") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_material.Ks"), this.material.Ks);
    }
    // u_material.shininess
    if (this.material.getUniform("u_material.shininess") != undefined) {
      gl.uniform1f(this.material.getUniform("u_material.shininess"), this.material.shininess);
    }
    // u_material.opacity
    if (this.material.getUniform("u_material.opacity") != undefined) {
      gl.uniform1f(this.material.getUniform("u_material.opacity"), this.material.opacity);
    }
    // u_color
    if (this.material.getUniform("u_color") != undefined) {
      gl.uniform4fv(this.material.getUniform("u_color"), this.material.color);
    }
    // u_texture
    if (this.material.getUniform("u_texture") != undefined) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
      gl.uniform1i(this.material.getUniform("u_texture"), 0);
    }
    ////////////////////////////////////////////////////////////


    // Smooth shading
    if (this.isSmooth && this.getFaces) {
      gl.bindVertexArray(this.smoothVAO);
      gl.drawElements(gl.TRIANGLES, this.num_smooth_elements, gl.UNSIGNED_SHORT, 0);
    }
    // Flat shading
    else {
      gl.bindVertexArray(this.flatVAO);
      gl.drawArrays(gl.TRIANGLES, 0, this.num_flat_elements);
    }

    gl.bindVertexArray(null);
  }

  /**
   * Función para dibujar la geometría sin un VAO, lo que permite usar un material variable
   */
  drawMaterial(gl, material, projectionMatrix, viewMatrix, light) {
    gl.useProgram(material.program);

    let viewModelMatrix = multiply(viewMatrix, this.transform);
    let projectionViewModelMatrix = multiply(projectionMatrix, viewModelMatrix);

    // u_VM_matrix
    if (material.getUniform("u_VM_matrix") != undefined) {
      gl.uniformMatrix4fv(material.getUniform("u_VM_matrix"), true, viewModelMatrix);
    }
    // u_PVM_matrix
    if (material.getUniform("u_PVM_matrix") != undefined) {
      gl.uniformMatrix4fv(material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix);
    }

    ////////////////////////////////////////////////////////////
    // Componentes de la luz
    ////////////////////////////////////////////////////////////
    // u_light.position
    if (material.getUniform("u_light.position") != undefined) {
      gl.uniform3fv(material.getUniform("u_light.position"), light.getPosition());
    }
    // u_light.La
    if (material.getUniform("u_light.La") != undefined) {
      gl.uniform3fv(material.getUniform("u_light.La"), light.ambient);
    }
    // u_light.Ld
    if (material.getUniform("u_light.Ld") != undefined) {
      gl.uniform3fv(material.getUniform("u_light.Ld"), light.diffuse);
    }
    // u_light.Ls
    if (material.getUniform("u_light.Ls") != undefined) {
      gl.uniform3fv(material.getUniform("u_light.Ls"), light.especular);
    }
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // Componentes del material
    ////////////////////////////////////////////////////////////
    // u_material.Ka
    if (material.getUniform("u_material.Ka") != undefined) {
      gl.uniform3fv(material.getUniform("u_material.Ka"), material.Ka);
    }
    // u_material.Kd
    if (material.getUniform("u_material.Kd") != undefined) {
      gl.uniform3fv(material.getUniform("u_material.Kd"), material.Kd);
    }
    // u_material.Ks
    if (material.getUniform("u_material.Ks") != undefined) {
      gl.uniform3fv(material.getUniform("u_material.Ks"), material.Ks);
    }
    // u_material.shininess
    if (material.getUniform("u_material.shininess") != undefined) {
      gl.uniform1f(material.getUniform("u_material.shininess"), material.shininess);
    }
    // u_material.color
    if (material.getUniform("u_material.color") != undefined) {
      gl.uniform4fv(material.getUniform("u_material.color"), material.color);
    }
    // u_color
    if (material.getUniform("u_color") != undefined) {
      gl.uniform4fv(material.getUniform("u_color"), material.color);
    }
    // u_texture
    if (material.getUniform("u_texture") != undefined) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, material.texture);
      gl.uniform1i(material.getUniform("u_texture"), 0);
    }
    
    ////////////////////////////////////////////////////////////
    // Como no se tiene un VAO que determine como se envía la información a los atributos, se debe especificar directamente en la función de dibujado, por eso se hace la activación de los buffers de datos y los atributos correspondientes antes de la llamada a drawElements o drawArrays
    // Smooth shading
    if (this.isSmooth && this.getFaces) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.smooth_positionBuffer);
      gl.enableVertexAttribArray(material.getAttribute("a_position"));
      gl.vertexAttribPointer(material.getAttribute("a_position"), 3, gl.FLOAT, false, 0, 0);

      // Normales
      if (material.getAttribute("a_normal") != undefined) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.smooth_normalBuffer);
        gl.enableVertexAttribArray(material.getAttribute("a_normal"));
        gl.vertexAttribPointer(material.getAttribute("a_normal"), 3, gl.FLOAT, false, 0, 0);
      }

      // Coordenadas UV
      if (material.getAttribute("a_texcoord") != undefined) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.smooth_normalBuffer);
        gl.enableVertexAttribArray(material.getAttribute("a_texcoord"));
        gl.vertexAttribPointer(material.getAttribute("a_texcoord"), 2, gl.FLOAT, false, 0, 0);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.smooth_indexBuffer);
      gl.drawElements(gl.TRIANGLES, this.num_smooth_elements, gl.UNSIGNED_SHORT, 0);
    }
    // Flat shading
    else {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.flat_positionBuffer);
      gl.enableVertexAttribArray(material.getAttribute("a_position"));
      gl.vertexAttribPointer(material.getAttribute("a_position"), 3, gl.FLOAT, false, 0, 0);

      // Normales
      if (material.getAttribute("a_normal") != undefined) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.flat_normalBuffer);
        gl.enableVertexAttribArray(material.getAttribute("a_normal"));
        gl.vertexAttribPointer(material.getAttribute("a_normal"), 3, gl.FLOAT, false, 0, 0);
      }

      // Coordenadas UV
      if (material.getAttribute("a_texcoord") != undefined) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.flat_normalBuffer);
        gl.enableVertexAttribArray(material.getAttribute("a_texcoord"));
        gl.vertexAttribPointer(material.getAttribute("a_texcoord"), 2, gl.FLOAT, false, 0, 0);
      }

      gl.drawArrays(gl.TRIANGLES, 0, this.num_flat_elements);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  /**
   */
  getSmoothNormals(vertices, faces) {
    let normals = new Array(vertices.length);
    normals.fill(0);

    let v1, v2, v3;
    let i1, i2, i3;
    let tmp;
    let n;

    for (let i=0; i<faces.length; i+=3) {
      i1 = faces[i  ]*3;
      i2 = faces[i+1]*3;
      i3 = faces[i+2]*3;

      v1 = { x: vertices[i1], y: vertices[i1 + 1], z: vertices[i1 + 2] };
      v2 = { x: vertices[i2], y: vertices[i2 + 1], z:vertices[i2 + 2] };
      v3 = { x: vertices[i3], y: vertices[i3 + 1], z: vertices[i3 + 2] };

      n = normalize(
        cross(subtract(v1, v2), subtract(v2, v3))
      );

      tmp = { x: normals[i1], y: normals[i1+1], z: normals[i1+2] };
      tmp = add(tmp, n);
      normals[i1  ] = tmp.x;
      normals[i1+1] = tmp.y;
      normals[i1+2] = tmp.z;


      tmp = { x: normals[i2], y: normals[i2+1], z: normals[i2+2] };
      tmp = add(tmp, n);
      normals[i2  ] = tmp.x;
      normals[i2+1] = tmp.y;
      normals[i2+2] = tmp.z;


      tmp = { x: normals[i3], y: normals[i3+1], z: normals[i3+2] };
      tmp = add(tmp, n);
      normals[i3  ] = tmp.x;
      normals[i3+1] = tmp.y;
      normals[i3+2] = tmp.z;
    }

    for (let i=0; i<normals.length; i+=3) {
      tmp = normalize({ x: normals[i], y: normals[i+1], z: normals[i+2] });
      normals[i  ] = tmp.x;
      normals[i+1] = tmp.y;
      normals[i+2] = tmp.z;
    }

    return normals;
  }


  /**
   */
  getFlatVertices(vertices, faces) {
    let flat_vertices = [];

    for (let i=0, l=faces.length; i<l; i++) {
      flat_vertices.push(
        vertices[faces[i]*3],    // x
        vertices[faces[i]*3 +1], // y
        vertices[faces[i]*3 +2], // z
      );
    }

    return flat_vertices;
  }

  /**
   */
  getFlatNormals(vertices) {
    let normals = [];
    let v1, v2, v3;
    let n;

    for (let i=0; i<vertices.length; i+=9) {
      v1 = { x: vertices[i  ], y: vertices[i+1], z: vertices[i+2] };
      v2 = { x: vertices[i+3], y: vertices[i+4], z: vertices[i+5] };
      v3 = { x: vertices[i+6], y: vertices[i+7], z: vertices[i+8] };

      n = normalize(
        cross(subtract(v1, v2), subtract(v2, v3))
      );

      normals.push(
        n.x, n.y, n.z, 
        n.x, n.y, n.z, 
        n.x, n.y, n.z
      );
    }

    return normals;
  }
}