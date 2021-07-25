class Chain {
  constructor(canvas_size, total_duration) {
    this._canvas_size = canvas_size;
    this._total_duration = total_duration;
    this._reset();
    this._generateStatuses();
  }

  _reset() {
    // number of letters in a chain
    this._length = 4 + Math.floor(Math.random() * 8);
    // "time" offset, so not every letter changes at the same time
    this._offset = Math.random();
    // fall duration relative to total duration
    this._duration = this._total_duration / Math.floor(Math.random() * 3 + 1);
    // letter size
    this._scl = Math.random() * 20 + 10;
    // random x and y starting positions
    this._x = Math.random() * this._canvas_size; // x coordinate never changes
    this._start_y = Math.random() * this._canvas_size;
    // total number of statuses
    this._total_statuses = Math.floor(Math.random() * 4 + 8);
    // period of the status change
    this._status_period = this._total_duration / this._total_statuses / 4;
    // current status
    this._status_counter = 0;
  }

  // each status is a set of letters
  _generateStatuses() {
    this._statuses = [];
    for (let i = 0; i < this._total_statuses; i++) {
      this._statuses.push(new Array(this._length));
      for (let j = 0; j < this._length; j++) {
        this._statuses[i][j] = String.fromCodePoint(0x3041 + Math.floor(Math.random() * 63));
      }
    }
  }

  move(frame_count) {
    const percent = (frame_count % this._duration) / this._duration;
    // move down the chain
    this._current_y = this._start_y + (this._canvas_size + this._scl * this._length) * percent;
    while (this._current_y > this._canvas_size) this._current_y -= this._canvas_size + this._scl * this._length;
    // select current status
    this._status_counter = Math.floor(percent * this._total_statuses + this._offset) % this._total_statuses;
  }

  show(ctx) {
    // rounding for better performances
    const x = Math.floor(this._x);
    const y = Math.floor(this._current_y);
    const scl = Math.floor(this._scl);

    ctx.save();
    ctx.translate(x, y);
    ctx.font = `${scl}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#2bee15";

    this._statuses[this._status_counter].forEach((l, i) => {
      ctx.fillText(l, 0, scl * i);
    });

    ctx.restore();
  }
}
