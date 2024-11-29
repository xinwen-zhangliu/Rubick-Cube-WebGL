class Octaedro extends GenericGeometry {
  /**
   * Octaedro
   * @param {Number} width el tamaño del octaedro
   */
  constructor(gl, width = 1, material, transform = identity()) {
    super(gl, material, transform);

    this.w = width;

    this.init(gl);
  }

  getVertices() {
    return [
      0, 0, this.w,
      this.w, 0, 0,
      -this.w, 0, 0,
      0, -this.w, 0,
      0, this.w, 0,
      0, 0, -this.w,
    ];
  }

  getFaces() {
    return [
      3, 1, 0,
      2, 3, 0,
      1, 4, 0,
      4, 2, 0,
      1, 3, 5,
      3, 2, 5,
      4, 1, 5,
      2, 4, 5
    ];
  }

  getUVCoordinates(vertices, flat) {
    let w = 682;
    let h = 512;

    this.uv = [
      250 / w, 200 / h,
      250 / w, 200 / h,
      250 / w, 200 / h,

      200 / w, 200 / h,
      200 / w, 200 / h,
      200 / w, 200 / h,

      250 / w, 150 / h,
      250 / w, 150 / h,
      250 / w, 150 / h,

      100 / w, 200 / h,
      100 / w, 200 / h,
      100 / w, 200 / h,

      340 / w, 300 / h,
      340 / w, 300 / h,
      340 / w, 300 / h,

      330 / w, 400 / h,
      330 / w, 400 / h,
      330 / w, 400 / h,

      450 / w, 200 / h,
      450 / w, 200 / h,
      450 / w, 200 / h,

      580 / w, 200 / h,
      580 / w, 200 / h,
      580 / w, 200 / h,
    ];

    return this.uv;
  }
}
