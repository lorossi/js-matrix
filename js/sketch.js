class Sketch extends Engine {
  preload() {
    this._chains_num = 250; // number of falling chains of letters
    this._duration = 900; // animation duration
    this._recording = false;
  }

  setup() {
    // create chains
    this._chains = [];
    for (let i = 0; i < this._chains_num; i++) this._chains.push(new Chain(this.height, this._duration));
    // setup capturer
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
      this._capturer_started = false;
    }
  }

  draw() {
    // start capturer
    if (!this._capturer_started && this._recording) {
      this._capturer_started = true;
      this._capturer.start();
      console.log("%c Recording started", "color: green; font-size: 2rem");
    }

    const current_frame = this.frameCount % 2 == 0 ? 0 : this._duration;
    this.ctx.save();
    this.background("#151515");
    this._chains.forEach((c) => {

      if (this._juggle) c.move(current_frame);
      else c.move(this.frameCount);

      c.show(this.ctx);
    });
    this.ctx.restore();

    // save frame
    if (this._recording) {
      if (this.frameCount < this._duration) {
        this._capturer.capture(this._canvas);
      } else {
        this._recording = false;
        this._capturer.stop();
        this._capturer.save();
        console.log("%c Recording ended", "color: red; font-size: 2rem");
      }
    }
  }

  click() {
    this.setup();
  }
}