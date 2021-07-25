class Sketch extends Engine {
  preload() {
    this._chains_num = 100; // number of falling chains of letters
  }

  setup() {
    this._chains = [];
    for (let i = 0; i < this._chains_num; i++) {
      const nc = new Chain(this.width);
      nc.generate();
      this._chains.push(nc);
    }
  }

  draw() {
    this.ctx.save();
    this.background("#151515");
    this._chains.forEach((c) => {
      c.show(this.ctx,);
      c.move(this.frameCount);

      if (c.dead) c.reset(); // reset fallen chains
    });
    this.ctx.restore();
  }
}