class Cono extends GenericGeometry {
  /**
   * Cono
   * @param {Number} radius el tamaño del cono
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(gl, radius = 1, height = 1, Nu = 1, Nv = 3, material, transform = identity()) {
    super(gl, material, transform);

    this.r = radius;
    this.h = height;
    this.Nu = Nu;
    this.Nv = Nv;

    this.init(gl);
  }

  getVertices() {
    let vertices = [];
    let phi; // la elevación en los paralelos
    let theta; // el ángulo en los meridianos

    // la punta del cono
    vertices.push(0);
    vertices.push((this.h / 2));
    vertices.push(0);

    // iteración para construir los paralelos
    for (let i = 0; i <= this.Nu; i++) {
      phi = (i + 1) * (this.h / (this.Nu + 1));

      for (let j = 0; j < this.Nv; j++) {
        // iteración para construir los meridianos
        theta = j * (2 * Math.PI / this.Nv);

        vertices.push((phi * this.r) / this.h * Math.cos(theta));
        vertices.push(this.h / 2 - phi);
        vertices.push((phi * this.r) / this.h * Math.sin(theta));
      }
    }

    return vertices;
  }

  getFaces() {
    let faces = [];

    for (let i = 0; i < this.Nv; i++) {
      faces.push(0); // indice del polo norte
      faces.push((i % this.Nv) + 1);
      faces.push(((i + 1) % this.Nv) + 1);
    }

    for (let i = 0; i <= this.Nu + 1; i++) {
      for (let j = 0; j <= this.Nv + 1; j++) {
        faces.push((j + 1) % this.Nv + (i + 1) * this.Nv);
        faces.push(j + i * this.Nv);
        faces.push((j + 1) % this.Nv + i * this.Nv);
        faces.push(j + (i + 1) * this.Nv);
        faces.push(j + i * this.Nv);
        faces.push((j + 1) % this.Nv + (i + 1) * this.Nv);
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

    let r = ((2*Math.PI)/8 + Math.PI/32) - 0.008;

    for (let i = 0; i < vertices.length / 3; i += 3) {
      p1 = new Vector3(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
      u1 = 0.5 + (Math.atan2(p1.z, p1.x) / PI2) + r;
      v1 = 0.5 + (p1.y / this.h);


      p2 = new Vector3(vertices[(i + 1) * 3], vertices[(i + 1) * 3 + 1], vertices[(i + 1) * 3 + 2]);
      u2 = 0.5 + (Math.atan2(p2.z, p2.x) / PI2) + r;
      v2 = 0.5 + (p2.y / this.h);


      p3 = new Vector3(vertices[(i + 2) * 3], vertices[(i + 2) * 3 + 1], vertices[(i + 2) * 3 + 2]);
      u3 = 0.5 + (Math.atan2(p3.z, p3.x) / PI2) + r;
      v3 = 0.5 + (p3.y / this.h);

      if (Math.abs(u1 - u2) > max_dist) {
        if (u1 > u2) {
          u2 = 1 + u2;
        }
        else {
          u1 = 1 + u1;
        }
      }
      if (Math.abs(u1 - u3) > max_dist) {
        if (u1 > u3) {
          u3 = 1 + u3;
        }
        else {
          u1 = 1 + u1;
        }
      }
      if (Math.abs(u2 - u3) > max_dist) {
        if (u2 > u3) {
          u3 = 1 + u3;
        }
        else {
          u2 = 1 + u2;
        }
      }

      uv.push(u1, v1, u2, v2, u3, v3);
    }

    return uv;
  }
}
