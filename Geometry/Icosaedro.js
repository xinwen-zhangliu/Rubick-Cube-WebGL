class Icosaedro extends GenericGeometry {
  /**
   */
  constructor(gl, width=1, material=new FlatMaterial(gl), transform=identity()) {
    super(gl, material, transform);

    this.w = width;

    this.init(gl);
  }

  /**
   */
  getVertices() {
    const goldenRatio = 1.6180339887;
    let width_m_goldenRatio = this.w*goldenRatio;

    let img_w = 1070;
    let img_h = 512;

    this.uv = [
      // 0
      195/img_w, 105/img_h,
      195/img_w, 105/img_h,
      195/img_w, 105/img_h,

      // 1
      390/img_w, 105/img_h,
      390/img_w, 105/img_h,
      390/img_w, 105/img_h,

      // 2
      584/img_w, 105/img_h,
      584/img_w, 105/img_h,
      584/img_w, 105/img_h,

      // 3
      776/img_w, 105/img_h,
      776/img_w, 105/img_h,
      776/img_w, 105/img_h,

      // 4
      980/img_w, 105/img_h,
      980/img_w, 105/img_h,
      980/img_w, 105/img_h,

      // 5
      194/img_w, 278/img_h,
      194/img_w, 278/img_h,
      194/img_w, 278/img_h,

      // 6
      94/img_w, 278/img_h,
      94/img_w, 278/img_h,
      94/img_w, 278/img_h,

      // 7
      994/img_w, 278/img_h,
      994/img_w, 278/img_h,
      994/img_w, 278/img_h,

      // 8
      894/img_w, 278/img_h,
      894/img_w, 278/img_h,
      894/img_w, 278/img_h,

      // 9
      794/img_w, 278/img_h,
      794/img_w, 278/img_h,
      794/img_w, 278/img_h,

      // 10
      694/img_w, 278/img_h,
      694/img_w, 278/img_h,
      694/img_w, 278/img_h,

      // 11
      594/img_w, 278/img_h,
      594/img_w, 278/img_h,
      594/img_w, 278/img_h,

      // 12
      494/img_w, 278/img_h,
      494/img_w, 278/img_h,
      494/img_w, 278/img_h,

      // 13
      394/img_w, 278/img_h,
      394/img_w, 278/img_h,
      394/img_w, 278/img_h,

      // 14
      294/img_w, 278/img_h,
      294/img_w, 278/img_h,
      294/img_w, 278/img_h,

      // 15
      870/img_w, 400/img_h,
      870/img_w, 400/img_h,
      870/img_w, 400/img_h,

      // 16
      680/img_w, 400/img_h,
      680/img_w, 400/img_h,
      680/img_w, 400/img_h,

      // 17
      480/img_w, 400/img_h,
      480/img_w, 400/img_h,
      480/img_w, 400/img_h,

      // 18
      290/img_w, 400/img_h,
      290/img_w, 400/img_h,
      290/img_w, 400/img_h,

      // 19
      100/img_w, 400/img_h,
      100/img_w, 400/img_h,
      100/img_w, 400/img_h,
    ];

    return [
      // 0
      -width_m_goldenRatio, 0,  this.w,
      0, -this.w,  width_m_goldenRatio,
      0,  this.w,  width_m_goldenRatio,

      // 1
      0,  this.w,  width_m_goldenRatio,
      0, -this.w,  width_m_goldenRatio,
      width_m_goldenRatio, 0,  this.w,

      // 2
      width_m_goldenRatio, 0,  this.w,
      0, -this.w,  width_m_goldenRatio,
      this.w, -width_m_goldenRatio, 0,

      // 3
      this.w, -width_m_goldenRatio, 0,
      0, -this.w,  width_m_goldenRatio,
      -this.w, -width_m_goldenRatio, 0,

      // 4
      -this.w, -width_m_goldenRatio, 0,
      0, -this.w,  width_m_goldenRatio,
      -width_m_goldenRatio, 0,  this.w,

      // 5
      -this.w,  width_m_goldenRatio, 0,
      -width_m_goldenRatio, 0,  this.w,
      0,  this.w,  width_m_goldenRatio,

      // 6
      -width_m_goldenRatio, 0, -this.w,
      -width_m_goldenRatio, 0,  this.w,
      -this.w,  width_m_goldenRatio, 0,

      // 7
      -this.w, -width_m_goldenRatio, 0,
      -width_m_goldenRatio, 0,  this.w,
      -width_m_goldenRatio, 0, -this.w,

      // 8
      -this.w, -width_m_goldenRatio, 0,
      -width_m_goldenRatio, 0, -this.w,
      0, -this.w, -width_m_goldenRatio,

      // 9
      this.w, -width_m_goldenRatio, 0,
      -this.w, -width_m_goldenRatio, 0,
      0, -this.w, -width_m_goldenRatio,

      // 10
      width_m_goldenRatio, 0, -this.w,
      this.w, -width_m_goldenRatio, 0,
      0, -this.w, -width_m_goldenRatio,

      // 11
      width_m_goldenRatio, 0,  this.w,
      this.w, -width_m_goldenRatio, 0,
      width_m_goldenRatio, 0, -this.w,

      // 12
      this.w,  width_m_goldenRatio, 0,
      width_m_goldenRatio, 0,  this.w,
      width_m_goldenRatio, 0, -this.w,

      // 13
      0,  this.w,  width_m_goldenRatio,
      width_m_goldenRatio, 0,  this.w,
      this.w,  width_m_goldenRatio, 0,

      // 14
      -this.w,  width_m_goldenRatio, 0,
      0,  this.w,  width_m_goldenRatio,
      this.w,  width_m_goldenRatio, 0,

      // 15
      -width_m_goldenRatio, 0, -this.w,
      0,  this.w, -width_m_goldenRatio,
      0, -this.w, -width_m_goldenRatio,

      // 16
      -this.w,  width_m_goldenRatio, 0,
      0,  this.w, -width_m_goldenRatio,
      -width_m_goldenRatio, 0, -this.w,

      // 17
      this.w,  width_m_goldenRatio, 0,
      0,  this.w, -width_m_goldenRatio,
      -this.w,  width_m_goldenRatio, 0,

      // 18
      width_m_goldenRatio, 0, -this.w,
      0,  this.w, -width_m_goldenRatio,
      this.w,  width_m_goldenRatio, 0,

      // 19
      0, -this.w, -width_m_goldenRatio,
      0,  this.w, -width_m_goldenRatio,
      width_m_goldenRatio, 0, -this.w,
    ];
  }

  /**
   */
  getUVCoordinates(vertices, flat) {
    return this.uv;
  }
}
