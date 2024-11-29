class Toroide extends GenericGeometry {
  /**
   * Toroide
   * @param {Number} major_radius el radio mayor del toroide
   * @param {Number} major_radius el radio menor del toroide
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(gl, major_radius = 1, minor_radius = 1, Nu = 1, Nv = 3, material,
              transform = identity()) {
    super(gl, material, transform);

    this.R = major_radius;
    this.r = minor_radius;
    this.Nu = Nu;
    this.Nv = Nv;

    this.init(gl);
  }

  getVertices() {
    let vertices = [];

    for (let i = 0; i < this.Nv; i++) {
      for (let j = 0; j < this.Nu; j++) {
        vertices.push(-(this.R + this.r *
                        Math.sin(2 * Math.PI * j /
                                 this.Nu))
                      * Math.sin(2 * Math.PI * i /
                                 this.Nv));
        vertices.push(this.r * Math.cos(2 * Math.PI * j
                                        / this.Nu));
        vertices.push((this.R + this.r
                       * Math.sin(2 * Math.PI * j /
                                  this.Nu))
                      * Math.cos(2 * Math.PI * i / this.Nv));
      }
    }

    return vertices;
  }

  getFaces() {
    let faces = [];

    for (let i = 0; i < this.Nv; i++) {
      for (let j = 0; j < this.Nu; j++) {
        const a = j + i * this.Nu;
        const b = j + ((i + 1) % this.Nv) * this.Nu;
        const c = (j + 1) % this.Nu + ((i + 1) % this.Nv) * this.Nu;
        const d = (j + 1) % this.Nu + i * this.Nu;
        faces.push(a);
        faces.push(b);
        faces.push(c);

        faces.push(a);
        faces.push(c);
        faces.push(d);
      }
    }

    return faces;
  }

  getUVCoordinates(vertices, flat) {
    let uv = [];
    let PI2 = Math.PI * 2;

    let max_dist = 0.75;
    let p1, p2, p3;
    let u1, v1, u2, v2, u3, v3;

    for (let i = 0; i < vertices.length / 3; i += 3) {
      p1 = new Vector3(vertices[i * 3], vertices[i * 3 + 1],
                       vertices[i * 3 + 2]);
      u2 = 0.5 + (p1.y / this.R);
      v1 = 0.5 + (Math.atan2(p1.z, p1.x) / PI2);


      p2 = new Vector3(vertices[(i + 1) * 3],
                       vertices[(i + 1) * 3 + 1],
                       vertices[(i + 1) * 3 + 2]);
      u2 = 0.5 + (p2.y / this.R);
      v2 = 0.5 + (Math.atan2(p2.z, p2.x) / PI2);


      p3 = new Vector3(vertices[(i + 2) * 3],
                       vertices[(i + 2) * 3 + 1],
                       vertices[(i + 2) * 3 + 2]);
      u3 = 0.5 + (p3.y / this.R);
      v3 = 0.5 + (Math.atan2(p3.z, p3.x) / PI2);


      if (Math.abs(v1 - v2) > max_dist) {
        if (v1 > v2) {
          v2 = 1 + v2;
        }
        else {
          v1 = 1 + v1;
        }
      }
      if (Math.abs(v1 - v3) > max_dist) {
        if (v1 > v3) {
          v3 = 1 + v3;
        }
        else {
          v1 = 1 + v1;
        }
      }
      if (Math.abs(v2 - v3) > max_dist) {
        if (v2 > v3) {
          v3 = 1 + v3;
        }
        else {
          v2 = 1 + v2;
        }
      }

      uv.push(u1, v1, u2, v2, u3, v3);
    }

    return uv;
  }
}
