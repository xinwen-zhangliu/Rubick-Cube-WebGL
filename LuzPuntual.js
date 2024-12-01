class LuzPuntual {
  constructor(pos={x:0,y:0,z:0}, ambient=[0.2,0.2,0.2], diffuse=[1,1,1], especular=[1,1,1]) {
    this.position = pos;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.especular = especular;
    this.position_transform = {x:0,y:0,z:0};
  }

  update(viewMatrix) {
    this.position_transform = viewMatrix.multiplyVector(this.position);
  }

  getPosition() {
    return [this.position_transform.x, this.position_transform.y, this.position_transform.z];
  }
}
