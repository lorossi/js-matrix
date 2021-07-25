/*
  HTML canvas simple engine. GitHub repo and some basic documentation: https://github.com/lorossi/empty-html5-canvas-project
  Made by Lorenzo Rossi. Website and contacts: https://lorenzoros.si/
*/

class Engine {
  constructor(canvas, ctx, fps = 60) {
    this._canvas = canvas;
    this._ctx = ctx;
    this._fps = fps;

    // init variables
    this._frameCount = 0;
    this._frameRate = 0;
    this._noLoop = false;
    this._fpsBuffer = new Array(0).fill(this._fps);
    // start sketch
    this._setFps();
    this._run();
  }

  _setFps() {
    // keep track of time to handle fps
    this.then = performance.now();
    // time between frames
    this._fps_interval = 1 / this._fps;
  }

  _run() {
    // bootstrap the sketch
    this.preload();
    this.setup();
    // anti alias
    this._ctx.imageSmoothingQuality = "high";
    this._timeDraw();
  }

  _timeDraw() {
    // request another frame
    window.requestAnimationFrame(this._timeDraw.bind(this));

    if (this._noLoop) return;

    let diff;
    diff = performance.now() - this.then;
    if (diff < this._fps_interval) {
      // not enough time has passed, so we request next frame and give up on this render
      return;
    }
    // updated last frame rendered time
    this.then = performance.now();
    // now draw
    this._ctx.save();
    this.draw();
    this._ctx.restore();
    // update frame count
    this._frameCount++;
    // update fpsBuffer
    this._fpsBuffer.unshift(1000 / diff);
    this._fpsBuffer = this._fpsBuffer.splice(0, 30);
    // calculate average fps
    this._frameRate = this._fpsBuffer.reduce((a, b) => a + b, 0) / this._fpsBuffer.length;
  }

  calculatePressCoords(e) {
    // calculate size ratio
    const boundingBox = this._canvas.getBoundingClientRect();
    const ratio = Math.min(boundingBox.width, boundingBox.height) / this._canvas.getAttribute("width");
    // calculate real mouse/touch position
    if (!e.touches) {
      // we're dealing with a mouse
      const mx = (e.pageX - boundingBox.left) / ratio;
      const my = (e.pageY - boundingBox.top) / ratio;
      return { x: mx, y: my };
    } else {
      // we're dealing with a touchscreen
      const tx = (e.touches[0].pageX - boundingBox.left) / ratio;
      const ty = (e.touches[0].pageY - boundingBox.top) / ratio;
      return { x: tx, y: ty };
    }
  }

  getPressedKey(e) {
    return {
      key: e.key,
      keyCode: e.keyCode,
      type: e.type,
    };
  }

  loop() {
    this._noLoop = false;
  }

  noLoop() {
    this._noLoop = true;
  }

  click(e) {
    //const coords = this._calculatePressCoords(e);
  }

  mousedown(e) {
    this._mouse_pressed = true;
  }

  mouseup(e) {
    this._mouse_pressed = false;
  }

  mousemove(e) {
    if (this._mouse_pressed) {

    }
  }

  touchdown(e) {
    this.mousedown(e);
  }

  touchup(e) {
    this.mouseup(e);
  }

  touchmove(e) {
    this.mousemove(e);
  }

  keydown(e) {
    //console.log({ code: e.code });
    this.getPressedKey(e);
  }

  saveFrame() {
    const title = "frame-" + this._frameCount.toString().padStart(6, 0);
    this.saveAsImage(title);
  }

  saveAsImage(title) {
    let container;
    container = document.createElement("a");
    container.download = title + ".png";
    container.href = this._canvas.toDataURL("image/png");
    document.body.appendChild(container);

    container.click();
    document.body.removeChild(container);
  }

  background(color) {
    // reset background
    this._ctx.save();
    // reset canvas
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    // set background
    this._ctx.fillStyle = color;
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.restore();
  }

  preload() {
    // ran once
  }

  setup() {
    // ran once
  }

  draw() {
    // ran continuously
  }

  get ctx() {
    return this._ctx;
  }

  get frameCount() {
    return this._frameCount;
  }

  get frameRate() {
    return this._frameRate;
  }

  set frameRate(f) {
    this._setFps(f);
  }

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // page loaded
  let canvas, ctx, s;
  canvas = document.querySelector("#sketch");
  // inject canvas in page
  if (canvas.getContext) {
    ctx = canvas.getContext("2d", { alpha: false });
    s = new Sketch(canvas, ctx);
  }

  // mouse event listeners
  canvas.addEventListener("click", e => s.click(e));
  canvas.addEventListener("mousedown", e => s.mousedown(e));
  canvas.addEventListener("mouseup", e => s.mouseup(e));
  canvas.addEventListener("mousemove", e => s.mousemove(e));
  // touchscreen event listeners
  canvas.addEventListener("touchstart", e => s.touchdown(e));
  canvas.addEventListener("touchend", e => s.touchup(e));
  canvas.addEventListener("touchmove", e => s.touchmove(e));
  // keyboard event listeners
  document.addEventListener("keydown", e => s.keydown(e));
});

class Color {
  constructor(a = 0, b = 0, c = 0, d = 0, rgb = true) {
    if (rgb) {
      this._r = a;
      this._g = b;
      this._b = c;
      this._a = d;

      this._h = undefined;
      this._s = undefined;
      this._l = undefined;
      this._toHsl();
    } else {
      this._h = a;
      this._s = b;
      this._l = c;
      this._a = d;

      this._r = undefined;
      this._g = undefined;
      this._b = undefined;
      this._toRgb();
    }
  }

  fromHSL(h, s, l) {
    this._h = h;
    this._s = s;
    this._l = l;

    this._toRgb();
  }

  fromRGB(r, g, b) {
    this._r = r;
    this._g = g;
    this._b = b;

    this._toHsl();
  }

  _toHsl() {
    const r = this._r / 255;
    const g = this._g / 255;
    const b = this._b / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    this._h = Math.floor(h * 360);
    this._s = Math.floor(s * 100);
    this._l = Math.floor(l * 100);
  }

  _toRgb() {
    if (this._s == 0) {
      this._r = this._l;
      this._g = this._l;
      this._b = this._l;
    } else {
      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const l = this._l / 100;
      const h = this._h / 360;
      const s = this._s / 100;

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;

      this._r = Math.floor(hueToRgb(p, q, h + 1 / 3) * 255);
      this._g = Math.floor(hueToRgb(p, q, h) * 255);
      this._b = Math.floor(hueToRgb(p, q, h - 1 / 3) * 255);
    }
  }

  // internal functions
  _toHex(dec) {
    dec = Math.floor(dec);
    return dec.toString(16).padStart(2, 0).toUpperCase();
  }

  _toDec(hex) {
    return parseInt(hex, 16);
  }

  _clamp(value, min, max) {
    return Math.min(Math.max(min, value), max);
  }

  _wrap(value, min, max) {
    while (value > max) value -= max - min;
    while (value < min) value += max - min;
    return value;
  }

  // setters and getters
  set hex(h) {
    this._r = this._toDec(h.slice(1, 3));
    this._g = this._toDec(h.slice(3, 5));
    this._b = this._toDec(h.slice(5, 7));

    const a = parseInt(h.slice(7, 9), 16);
    if (isNaN(a)) this._a = 1;
    else this._a = a;

    this._toHsl();
  }

  get hex() {
    return `#${this._toHex(this._r)}${this._toHex(this._g)}${this._toHex(this._a)}`;
  }

  get rgb() {
    return `rgb(${this._r}, ${this._g}, ${this._b})`;
  }

  get rgba() {
    return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
  }

  get hsl() {
    return `hsl(${this._h}, ${this._s}%, ${this._l}%)`;
  }

  get hsla() {
    return `hsla(${this._h}, ${this._s}%, ${this._l}%, ${this._a})`;
  }

  get r() {
    return this._r;
  }

  set r(x) {
    this._r = Math.floor(this._clamp(x, 0, 255));
    this._toHsl();
  }

  get g() {
    return this._g;
  }

  set g(x) {
    this._g = Math.floor(this._clamp(x, 0, 255));
    this._toHsl();
  }

  get b() {
    return this._b;
  }

  set b(x) {
    this._b = Math.floor(this._clamp(x, 0, 255));
    this._toHsl();
  }

  get a() {
    return this._a;
  }

  set a(x) {
    this._a = this._clamp(x, 0, 1);
  }

  get h() {
    return this._h;
  }

  set h(x) {
    this._h = Math.floor(this._wrap(x, 0, 360));
    this._toRgb();
  }

  get s() {
    return this._s;
  }

  set s(x) {
    this._s = Math.floor(this._clamp(x, 0, 100));
    this._toRgb();
  }

  get l() {
    return this._l;
  }

  set l(x) {
    this._l = Math.floor(this._clamp(x, 0, 255));
    this._toRgb();
  }

  get monochrome() {
    if (this._r == this._g && this._g == this._b) return this._r;
    else return false;
  }

  set monochrome(s) {
    this._r = s;
    this._g = s;
    this._b = s;
    this._toHsl();
  }
}

class Point {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  set x(nx) {
    this._x = nx;
  }

  get y() {
    return this._y;
  }

  set y(ny) {
    this._y = ny;
  }
}