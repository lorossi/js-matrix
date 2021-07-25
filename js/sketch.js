class Sketch extends Engine {
  preload() {
    this._chains_num = 150; // number of falling chains of letters
    this._duration = 600; // animation duration
    this._border = 100;
  }

  setup() {
    this._chains = [];
    for (let i = 0; i < this._chains_num; i++) this._chains.push(new Chain(this.height, this._duration));
  }

  draw() {
    const current_frame = this.frameCount % 2 == 0 ? 0 : this._duration;
    this.ctx.save();
    this.background("#151515");
    this._chains.forEach((c) => {

      if (this._juggle) c.move(current_frame);
      else c.move(this.frameCount);

      c.show(this.ctx);
    });
    this.ctx.restore();
  }
}