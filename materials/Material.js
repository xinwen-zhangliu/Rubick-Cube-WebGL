let materialCache = {};

class Material {
  constructor(gl, vertexShaderSource, fragmentShaderSource) {
    if (materialCache[this.constructor.name]) {
      this.program = materialCache[this.constructor.name];
    }
    else {
      materialCache[this.constructor.name] = createProgram(gl, vertexShaderSource, fragmentShaderSource);
      this.program = materialCache[this.constructor.name];
    }

    this.attributes = this.getAttributesList(gl);
    this.uniforms = this.getUniformsList(gl);
  }

  /**
   */
  getAttributesList(gl) {
    let attributes = {};
    let tmp_attribute_name;

    for (let i=0, l=gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES); i<l; i++) {
      tmp_attribute_name = gl.getActiveAttrib(this.program, i).name;
      attributes[tmp_attribute_name] = gl.getAttribLocation(this.program, tmp_attribute_name);
    }

    return attributes;
  }

  /**
   */
  getUniformsList(gl) {
    let uniforms = {};
    let tmp_uniform_name;

    for (let i=0, l=gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS); i<l; i++) {
      tmp_uniform_name = gl.getActiveUniform(this.program, i).name;
      uniforms[tmp_uniform_name] = gl.getUniformLocation(this.program, tmp_uniform_name);
    }

    return uniforms;
  }

  /** 
   */
  getAttribute(name) {
    return this.attributes[name];
  }

  /** 
   */
  getUniform(name) {
    return this.uniforms[name];
  }
}
