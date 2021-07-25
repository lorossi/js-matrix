class Chain {
  constructor(canvas_width, canvas_height, max_duration) {
    this._canvas_width = canvas_width;
    this._canvas_height = canvas_height;
    this._max_duration = max_duration;
    this._max_statuses = 10;
    this._reset();
    this._generateStatuses();
  }

  _reset() {
    // number of letters in a chain
    this._length = 4 + Math.floor(Math.random() * 8);
    // "time" offset, so not every letter changes at the same time
    this._offset = Math.random();

    this._duration = this._max_duration / Math.floor(Math.random() * 3 + 1);
    this._scl = Math.random() * 20 + 10; // letter size

    // random x and y starting positions
    this._x = Math.random() * this._canvas_width;
    this._start_y = Math.random() * this._canvas_height;
    // period of the status change
    this._status_period = this._max_duration / this._max_statuses;
    // current status
    this._status_counter = 0;
  }

  _generateStatuses() {
    this._statuses = [];
    for (let i = 0; i < this._max_statuses; i++) {
      this._statuses.push(new Array(this._length));
      for (let j = 0; j < this._length; j++) {
        this._statuses[i][j] = String.fromCodePoint(0x3041 + Math.floor(Math.random() * 63));
      }
    }
  }

  move(frame_count) {
    const percent = (frame_count % this._duration) / this._duration;
    // move down the chain
    this._current_y = this._start_y + this._canvas_height * percent;
    while (this._current_y > this._canvas_height) this._current_y -= this._canvas_height;
    // select current status
    this._status_counter = Math.floor(percent * this._max_statuses + this._offset) % this._max_statuses;
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
