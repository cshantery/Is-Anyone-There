class MoveBlock {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.drag = false;
    this.dragDx = 0;
    this.dragDy = 0;

    this.color = [random(255), random(255), random(255)];
  }

  isMouseInBounds(mx, my) {
    const m = mx != null && my != null ? { x: mx, y: my } : VM.mouse();
    return (
      m.x >= this.x &&
      m.x <= this.x + this.size &&
      m.y >= this.y &&
      m.y <= this.y + this.size
    );
  }

  update(dt) {
    if (!this.drag) return;

    const m = VM.mouse();
    this.x = m.x - this.dragDx;
    this.y = m.y - this.dragDy;
  }

  draw() {
    const u = VM.u();
    const v = VM.v();

    noStroke();
    fill(this.color[0], this.color[1], this.color[2]);
    rect(this.x * u, this.y * v, this.size * u, this.size * v, 8);
  }

  mousePressed(p) {
    if (this.isMouseInBounds(p?.x, p?.y)) {
      const m = VM.mouse();
      this.drag = true;
      this.dragDx = m.x - this.x;
      this.dragDy = m.y - this.y;
    }
  }

  mouseReleased() {
    this.drag = false;
  }
}
