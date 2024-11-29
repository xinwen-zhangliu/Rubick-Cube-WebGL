class Dodecaedro extends GenericGeometry {
  /**
   * Dodecaedro
   * @param {Number} width el tamaño del dodecaedro
   */
  constructor(gl, width = 1, material, transform = identity()) {
    super(gl, material, transform);

    this.w = width;

    this.init(gl);
  }

  getVertices() {
    const goldenRatio = 1.6180339887;
    let width_d_goldenRatio = this.w / goldenRatio;
    let width_m_goldenRatio = this.w * goldenRatio;

    return [
      this.w, -this.w, this.w,
      this.w, -this.w, -this.w,
      this.w, this.w, this.w,
      this.w, this.w, -this.w,

      -this.w, -this.w, this.w,
      -this.w, -this.w, -this.w,
      -this.w, this.w, this.w,
      -this.w, this.w, -this.w,

      0, -width_d_goldenRatio, width_m_goldenRatio,
      0, -width_d_goldenRatio, -width_m_goldenRatio,
      0, width_d_goldenRatio, width_m_goldenRatio,
      0, width_d_goldenRatio, -width_m_goldenRatio,

      width_d_goldenRatio, -width_m_goldenRatio, 0,
      width_d_goldenRatio, width_m_goldenRatio, 0,
      -width_d_goldenRatio, -width_m_goldenRatio, 0,
      -width_d_goldenRatio, width_m_goldenRatio, 0,

      width_m_goldenRatio, 0, width_d_goldenRatio,
      width_m_goldenRatio, 0, -width_d_goldenRatio,
      -width_m_goldenRatio, 0, width_d_goldenRatio,
      -width_m_goldenRatio, 0, -width_d_goldenRatio,
    ];
  }

  getFaces() {
    return [
      0, 16, 2,
      0, 2, 8,
      2, 10, 8,

      12, 1, 17,
      12, 17, 0,
      17, 16, 0,

      8, 4, 14,
      8, 14, 0,
      14, 12, 0,

      2, 16, 17,
      2, 17, 13,
      17, 3, 13,

      13, 15, 6,
      13, 6, 2,
      6, 10, 2,

      6, 18, 4,
      6, 4, 10,
      4, 8, 10,

      3, 17, 1,
      3, 1, 11,
      1, 9, 11,

      13, 3, 11,
      13, 11, 15,
      11, 7, 15,

      1, 12, 14,
      1, 14, 9,
      14, 5, 9,

      11, 9, 5,
      11, 5, 7,
      5, 19, 7,

      5, 14, 4,
      5, 4, 19,
      4, 18, 19,

      6, 15, 7,
      6, 7, 18,
      7, 19, 18,
    ];
  }

  getUVCoordinates(vertices, flat) {
    let w = 1030;
    let h = 512;

    this.uv = [
      240 / w, 100 / h,
      240 / w, 100 / h,
      240 / w, 100 / h,
      240 / w, 100 / h,
      240 / w, 100 / h,
      240 / w, 100 / h,
      240 / w, 100 / h,
      240 / w, 100 / h,
      240 / w, 100 / h,

      240 / w, 256 / h,
      240 / w, 256 / h,
      240 / w, 256 / h,
      240 / w, 256 / h,
      240 / w, 256 / h,
      240 / w, 256 / h,
      240 / w, 256 / h,
      240 / w, 256 / h,
      240 / w, 256 / h,

      40 / w, 256 / h,
      40 / w, 256 / h,
      40 / w, 256 / h,
      40 / w, 256 / h,
      40 / w, 256 / h,
      40 / w, 256 / h,
      40 / w, 256 / h,
      40 / w, 256 / h,
      40 / w, 256 / h,

      400 / w, 100 / h,
      400 / w, 100 / h,
      400 / w, 100 / h,
      400 / w, 100 / h,
      400 / w, 100 / h,
      400 / w, 100 / h,
      400 / w, 100 / h,
      400 / w, 100 / h,
      400 / w, 100 / h,

      700 / w, 100 / h,
      700 / w, 100 / h,
      700 / w, 100 / h,
      700 / w, 100 / h,
      700 / w, 100 / h,
      700 / w, 100 / h,
      700 / w, 100 / h,
      700 / w, 100 / h,
      700 / w, 100 / h,

      1000 / w, 256 / h,
      1000 / w, 256 / h,
      1000 / w, 256 / h,
      1000 / w, 256 / h,
      1000 / w, 256 / h,
      1000 / w, 256 / h,
      1000 / w, 256 / h,
      1000 / w, 256 / h,
      1000 / w, 256 / h,

      500 / w, 256 / h,
      500 / w, 256 / h,
      500 / w, 256 / h,
      500 / w, 256 / h,
      500 / w, 256 / h,
      500 / w, 256 / h,
      500 / w, 256 / h,
      500 / w, 256 / h,
      500 / w, 256 / h,

      600 / w, 256 / h,
      600 / w, 256 / h,
      600 / w, 256 / h,
      600 / w, 256 / h,
      600 / w, 256 / h,
      600 / w, 256 / h,
      600 / w, 256 / h,
      600 / w, 256 / h,
      600 / w, 256 / h,

      250 / w, 400 / h,
      250 / w, 400 / h,
      250 / w, 400 / h,
      250 / w, 400 / h,
      250 / w, 400 / h,
      250 / w, 400 / h,
      250 / w, 400 / h,
      250 / w, 400 / h,
      250 / w, 400 / h,

      600 / w, 400 / h,
      600 / w, 400 / h,
      600 / w, 400 / h,
      600 / w, 400 / h,
      600 / w, 400 / h,
      600 / w, 400 / h,
      600 / w, 400 / h,
      600 / w, 400 / h,
      600 / w, 400 / h,

      800 / w, 400 / h,
      800 / w, 400 / h,
      800 / w, 400 / h,
      800 / w, 400 / h,
      800 / w, 400 / h,
      800 / w, 400 / h,
      800 / w, 400 / h,
      800 / w, 400 / h,
      800 / w, 400 / h,

      750 / w, 256 / h,
      750 / w, 256 / h,
      750 / w, 256 / h,
      750 / w, 256 / h,
      750 / w, 256 / h,
      750 / w, 256 / h,
      750 / w, 256 / h,
      750 / w, 256 / h,
      750 / w, 256 / h,
    ];

    return this.uv;
  }
}
