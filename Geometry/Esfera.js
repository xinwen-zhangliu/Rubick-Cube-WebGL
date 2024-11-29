class Esfera extends GenericGeometry {
  /**
   */
  constructor(gl, radius=1, Nu=8, Nv=8, material=new FlatMaterial(gl), transform=identity()) {
    super(gl, material, transform);

    this.r = radius;
    this.Nu = Nu;
    this.Nv = Nv;

    this.init(gl);
  }

  /**
   */
  getVertices() {
    let vertices = [];
    let phi;
    let theta;

    vertices.push(0, this.r, 0);

    for (let i=0; i<this.Nu; i++) {
      phi = Math.PI/2 - (i+1)*(Math.PI/(this.Nu+1));

      for (let j=0; j<this.Nv; j++) {
        theta = j*(2*Math.PI/this.Nv);

        vertices.push(
          this.r * Math.cos(phi) * Math.cos(theta),
          this.r * Math.sin(phi),
          this.r * Math.cos(phi) * Math.sin(theta)
        );
      }
    }

    vertices.push(0, -this.r, 0);

    return vertices;
  }

  /**
   */
  getFaces() {
    let faces = [];

    for (let i=0; i<this.Nv; i++) {
      faces.push(
        0,
        ((i+1)%this.Nv)+1,
        (i%this.Nv)+1,
      );
    }

    for (let i=0; i<this.Nu-1; i++) {
      for (let j=0; j<this.Nv; j++) {
        faces.push(
          j+1 + i*this.Nv,
          (j+1)%this.Nv +1 + i*this.Nv,
          (j+1)%this.Nv +1 + (i+1)*this.Nv,
          j+1 + i*this.Nv,
          (j+1)%this.Nv +1 + (i+1)*this.Nv,
          j+1 + (i+1)*this.Nv,
        );
      }
    }

    for (let i=0; i<this.Nv; i++) {
      faces.push(
        this.vertices.length/3-1,
        this.vertices.length/3-1 -this.Nv +i,
        this.vertices.length/3-1 -this.Nv +((i+1)%this.Nv)
      );
    }

    return faces;
  }

  /**
   */
  getUVCoordinates(vertices, isFlat) {
    let uv = [];
    let PI2 = Math.PI*2;

    if (!isFlat) {
      let p, u, v;

      for (let i=0, l=vertices.length/3; i<l; i++) {
        p = new Vector3(vertices[i*3], vertices[i*3 +1], vertices[i*3 +2]).normalize();

        uv.push(
          0.5 + (Math.atan2(p.z, p.x) / PI2),
          0.5 + (Math.asin(p.y) / Math.PI)
        );
      }
    }
    else {
      let max_dist = 0.75;
      let p1, p2, p3;
      let u1, v1, u2, v2, u3, v3;

      for (let i=0; i<vertices.length/3; i+=3) {
        p1 = new Vector3(vertices[i*3], vertices[i*3 +1], vertices[i*3 +2]).normalize();
        u1 = 0.5 + (Math.atan2(p1.z, p1.x) / PI2);
        v1 = 0.5 + (Math.asin(p1.y) / Math.PI);

        p2 = new Vector3(vertices[(i+1)*3], vertices[(i+1)*3 +1], vertices[(i+1)*3 +2]).normalize();
        u2 = 0.5 + (Math.atan2(p2.z, p2.x) / PI2);
        v2 = 0.5 + (Math.asin(p2.y) / Math.PI);

        p3 = new Vector3(vertices[(i+2)*3], vertices[(i+2)*3 +1], vertices[(i+2)*3 +2]).normalize();
        u3 = 0.5 + (Math.atan2(p3.z, p3.x) / PI2);
        v3 = 0.5 + (Math.asin(p3.y) / Math.PI);

        if (Math.abs(u1-u2) > max_dist) {
          if (u1 > u2) {
            u2 = 1 + u2;
          }
          else {
            u1 = 1 + u1;
          }
        }
        if (Math.abs(u1-u3) > max_dist) {
          if (u1 > u3) {
            u3 = 1 + u3;
          }
          else {
            u1 = 1 + u1;
          }
        }
        if (Math.abs(u2-u3) > max_dist) {
          if (u2 > u3) {
            u3 = 1 + u3;
          }
          else {
            u2 = 1 + u2;
          }
        }

        uv.push( u1, v1, u2, v2, u3, v3 );
      }
    }

    return uv;
  }

}
