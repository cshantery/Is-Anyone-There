// Bare Bones Label Class
class Label {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
  }

  setText(newText) {
    this.text = newText;
  }

  draw() {
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(0);
    text(this.text, this.x, this.y);
  }
}
