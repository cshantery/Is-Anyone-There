class Timer {
  constructor(duration) { 
    this.duration = duration;
    this.start = millis();
  }

  reset() {
    this.start = millis();
  }

  getRemaining() {
    let elapsed = millis() - this.start;
    return max(0, this.duration - elapsed);
  }

  isFinished() {
    return this.getRemaining() === 0;
  }

  getSeconds() {
    return ceil(this.getRemaining() / 1000);
  }
}