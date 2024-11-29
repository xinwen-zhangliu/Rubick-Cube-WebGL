class Tetraedro extends GenericGeometry {
  /**
   * Tetraedro
   * @param {Number} width el tamaño del tetraedro
   */
  constructor(gl, width = 1, material, transform = identity()) {
    super(gl, material, transform);

    this.w = width;

    this.init(gl);
  }

  getVertices() {
    let angle = 2 * Math.PI / 3;
    let x = this.w * 2 * Math.sqrt(2) / 3;
    let y = -this.w / 3;
    let z = 0;
    let x0 = x * Math.cos(angle);
    let z0 = -x * Math.sin(angle);

    return [
      0, this.w, 0,
      x0, y, z0,
      x0, y, -z0,
      x, y, z,
    ];
  }

  getFaces() {
    return [
      1, 3, 2,
      0, 1, 2,
      0, 2, 3,
      0, 3, 1
    ];
  }

  getUVCoordinates(vertices, flat) {
    let w = 598;
    let h = 512;

    this.uv = [
      50/w, 50/h,
      50/w, 50/h,
      50/w, 50/h,

      300/w, 50/h,
      300/w, 50/h,
      300/w, 50/h,

      375/w, 50/h,
      375/w, 50/h,
      375/w, 50/h,

      250/w, 300/h,
      250/w, 300/h,
      250/w, 300/h,
    ];

    return this.uv;
  }
}
