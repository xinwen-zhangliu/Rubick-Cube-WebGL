class PrismaRectangular extends GenericGeometry {
  /**
   * Prisma Rectangular
   * @param {Number} width el ancho corresponde a la dimensión en el eje X
   * @param {Number} height el alto corresponde a la dimensión en el eje Y
   * @param {Number} length la profundidad corresponde a la dimensión en
   * el eje Z
   */
  constructor(gl, width = 1, height = 1, length = 1, material, transform = identity()) {
    super(gl, material, transform);

    this.w = width;
    this.h = height;
    this.l = length;

    this.init(gl);
  }

  getVertices() {
    return [
      -this.w / 2, this.h / 2, this.l / 2,
      -this.w / 2, -this.h / 2, this.l / 2,
      -this.w / 2, this.h / 2, -this.l / 2,
      -this.w / 2, -this.h / 2, -this.l / 2,
      this.w / 2, this.h / 2, this.l / 2,
      this.w / 2, -this.h / 2, this.l / 2,
      this.w / 2, this.h / 2, -this.l / 2,
      this.w / 2, -this.h / 2, -this.l / 2,
    ];
  }

  getFaces() {
    return [
      2, 3, 1,
      2, 1, 0,

      1, 5, 4,
      1, 4, 0,

      5, 7, 6,
      5, 6, 4,

      6, 7, 3,
      6, 3, 2,

      4, 6, 2,
      4, 2, 0,

      3, 7, 5,
      3, 5, 1
    ];
  }

  getUVCoordinates(vertices, flat) {
    let w = 512;
    let h = 512;

    return [
      /* naranja */
      50 / w, 256 / h,
      50 / w, 256 / h,
      50 / w, 256 / h,
      50 / w, 256 / h,
      50 / w, 256 / h,
      50 / w, 256 / h,

      /* amarillo */
      200 / w, 256 / h,
      200 / w, 256 / h,
      200 / w, 256 / h,
      200 / w, 256 / h,
      200 / w, 256 / h,
      200 / w, 256 / h,

      /* azul int */
      300 / w, 256 / h,
      300 / w, 256 / h,
      300 / w, 256 / h,
      300 / w, 256 / h,
      300 / w, 256 / h,
      300 / w, 256 / h,

      /* azul */
      500 / w, 256 / h,
      500 / w, 256 / h,
      500 / w, 256 / h,
      500 / w, 256 / h,
      500 / w, 256 / h,
      500 / w, 256 / h,

      /* rojo */
      200 / w, 100 / h,
      200 / w, 100 / h,
      200 / w, 100 / h,
      200 / w, 100 / h,
      200 / w, 100 / h,
      200 / w, 100 / h,

      /* azul tn */
      200 / w, 400 / h,
      200 / w, 400 / h,
      200 / w, 400 / h,
      200 / w, 400 / h,
      200 / w, 400 / h,
      200 / w, 400 / h,
    ];
  }
}
