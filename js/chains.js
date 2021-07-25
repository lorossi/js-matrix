class Chain {
  constructor(container_size) {
    this._container_size = container_size; // size of the canvas
    this._length = 4 + Math.floor(Math.random() * 8); // number of letters in a chain
    this._offset = Math.floor(Math.random() * 60); // "time" offset, so not every letter changes at the same time

    this.reset();

    this._y = Math.random() * this._container_size;  // y position, so that not everything starts on top
  }

  reset() {
    const z = Math.random(); // depth
    this._scl = z * 30 + 5; // letter size
    this._speed = z * 2 + 0.5; // falling speed

    this._x = Math.random() * this._container_size;
    this._y = -this._scl * this._length; // starts above the screen

    this._frame_update = Math.floor(Math.random() * 30 + 30); // frequency of the update
    this._dead = false;
  }

  generate() {
    // generate the letters (kanji)
    this._letters = new Array(this._length)
      .fill(null)
      .map(() => String.fromCodePoint(0x3041 + Math.floor(Math.random() * 63)));
  }

  move(frame_count) {
    // move down the chain
    this._y += this._speed;
    if (this._y > this._container_size) {
      this._dead = true;
    } else if ((frame_count + this._offset) % this._frame_update == 0) {
      this.generate();
    }
  }

  show(ctx) {
    // rounding for better performances
    const x = Math.floor(this._x);
    const y = Math.floor(this._y);
    const scl = Math.floor(this._scl);

    ctx.save();
    ctx.translate(x, y);
    ctx.font = `${scl}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#2bee15";

    this._letters.forEach((l, i) => {
      ctx.fillText(l, 0, scl * i);
    });

    ctx.restore();
  }

  // getter
  get dead() {
    return this._dead;
  }
}
