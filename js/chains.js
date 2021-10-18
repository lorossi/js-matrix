class Chain {
  constructor(canvas_size, total_duration) {
    this._canvas_size = canvas_size;
    this._total_duration = total_duration;
    this._reset();
    this._generateStatuses();
  }

  _reset() {
    // number of letters in a chain
    this._length = 7 + Math.floor(Math.random() * 10);
    // the fall time is an integer fraction of the total animation time
    const max_duration = 4;
    this._duration_factor = Math.floor(Math.random() * max_duration + 1);
    // fall duration relative to total duration
    this._duration = this._total_duration / this._duration_factor;
    // letter size
    this._scl = (this._duration_factor / max_duration * 40 + 10) * 0.8 + Math.random() * 0.4;
    // random x and y starting positions
    this._x = Math.random() * this._canvas_size; // x coordinate never changes
    this._start_y = Math.random() * this._canvas_size;
    // total number of statuses
    this._total_statuses = Math.floor(Math.random() * 4 + 8);
    // period of the status change
    this._status_period = this._total_duration / this._total_statuses / 8;
    // "time" offset, so not every letter changes at the same time
    this._offset = Math.random() * this._total_statuses;
    // current status
    this._status_counter = 0;
    // color alpha
    this._alpha = this._duration_factor / max_duration * 0.25 + 0.75;
    // white flashing text
    const flash_length = Math.floor(20 / this._duration_factor);
    this._flash = [...new Array(flash_length)].map(() => Math.round(Math.random() * this._duration));
    this._flash_frame = false;
    this._flash_duration = 4;
    this._flash_count = 0;
  }

  // each status is a set of letters
  _generateStatuses() {
    this._statuses = [];
    for (let i = 0; i < this._total_statuses; i++) {
      this._statuses.push(new Array(this._length));
      for (let j = 0; j < this._length; j++) {
        // utf-8 value for kanji
        this._statuses[i][j] = String.fromCodePoint(0x3041 + Math.floor(Math.random() * 63));
      }
    }
  }

  move(frame_count) {
    const percent = (frame_count % this._duration) / this._duration;
    // move down the chain
    this._current_y = this._start_y + (this._canvas_size + this._scl * this._length) * percent * this._duration_factor;
    while (this._current_y > this._canvas_size) this._current_y -= this._canvas_size + this._scl * this._length;
    // select current status
    this._status_counter = Math.floor(percent * this._total_statuses + this._offset) % this._total_statuses;
    // check if the first letter should flash
    if (this._flash.includes(frame_count % this._duration)) {
      this._flash_count = this._flash_duration
    }

    if (this._flash_count > 0) {
      this._flash_count--;
      this._flash_frame = true;
    } else {
      this._flash_frame = false;
    }
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

    this._statuses[this._status_counter].forEach((l, i) => {
      const alpha = this._alpha / this._length * i;
      if (this._flash_frame && i == this._length - 1) {
        this._flash_frame = false;
        ctx.fillStyle = "white";
      } else {
        ctx.fillStyle = `rgba(102, 255, 0, ${alpha})`; // bright green
      }

      ctx.fillText(l, 0, scl * i);
    });

    ctx.restore();
  }
}