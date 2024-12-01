class Camera {

  radians(degrees) {
    return degrees * Math.PI / 180.0;
  }
  constructor(pos = { x: 0, y: 0, z: 1 }, coi = { x: 0, y: 0, z: 0 },
    up = { x: 0, y: 1, z: 0 }) {
    this.pos = pos;
    this.coi = coi;
    this.up = up;

    this.radius = Vector3.distance(this.pos, this.coi);
    let direction = Vector3.subtract(this.pos, this.coi);

    this.theta = Math.atan2(direction.z, direction.x);
    this.phi = Math.atan2(direction.y, direction.z);

  }

  /** */
  getMatrix() {
    return Matrix4.lookAt(this.pos, this.coi, this.up)
  }

  /** */
  finishMove(init_mouse, current_mouse) {
    let angles = this.getAngles(init_mouse, current_mouse);
    this.theta = angles.theta;
    this.phi = angles.phi;
  }



  /** */
  rotate(init_mouse, current_mouse) {
    let angles = this.getAngles(init_mouse, current_mouse);

    this.pos = {
      x: this.coi.x + this.radius * Math.cos(angles.phi)
        * Math.cos(angles.theta),
      y: this.coi.y + this.radius * Math.sin(angles.phi),
      z: this.coi.z + this.radius * Math.cos(angles.phi)
        * Math.sin(angles.theta)
    };
  }

  /** */
  getAngles(init_mouse, current_mouse) {
    const EPSILON = 0.01;

    let theta = this.theta + (current_mouse.x - init_mouse.x) / 100;

    let phi = Math.min(
      Math.max(
        this.phi + (current_mouse.y - init_mouse.y) / 100,
        -Math.PI / 2 + EPSILON
      ),
      Math.PI / 2 - EPSILON
    );

    return {
      theta: theta,
      phi: phi
    };
  }

  /** */
  registerMouseEvents(canvas, draw_callback) {
    let initial_mouse_position = null;

    canvas.onpointerdown = (evt) => {
      var clicker = clicker = evt.button;;
      canvas.setPointerCapture(evt.pointerId);
      initial_mouse_position = getMousePositionInElement(evt, canvas);
      
      canvas.onpointermove = (evt) => {
        var mousePos = getMousePositionInElement(evt, canvas)
        // right click will trigger face rotation
        if (clicker == 2){
          // normalize the mouse position into NDC
          const ndcX = (mousePos.x / canvas.width) * 2 - 1;  // NDC X from -1 to 1
          const ndcY = -(mousePos.y / canvas.height) * 2 + 1; // NDC Y from -1 to 1
          const rayClipSpace = [ndcX, ndcY, -1, 1];

        }
        this.rotate(initial_mouse_position, mousePos);
        draw_callback();
      }
    };

    canvas.onpointerup = (evt) => {
      if (initial_mouse_position != null) {
        this.finishMove(initial_mouse_position, getMousePositionInElement(evt, canvas));
      }
      canvas.onpointermove = null;
      initial_mouse_position = null;
    };
  }
}
