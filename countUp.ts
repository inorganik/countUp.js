export interface CountUpOptions { // (default)
  startVal?: number; // number to start at (0)
  decimals: number; // number of decimal places (0)
  duration: number; // animation duration in seconds (2)
  useEasing?: boolean; // ease animation (true)
  useGrouping?: boolean; // example: 1,000 vs 1000 (true)
  autoSmoothThreshold?: number; // smooth easing for large numbers above this (999)
  smoothAmount?: number; // amount to be counted if auto-smoothed
  separator?: string; // grouping separator (,)
  decimal?: string; // decimal (.)
  // easingFn: easing function for animation (easeOutExpo)
  easingFn?: (t: number, b: number, c: number, d: number) => number;
  formattingFn?: (n: number) => string; // this function formats result
  prefix?: string; // text prepended to result
  suffix?: string; // text appended to result
}

export class CountUp {

  version = '2.0.0';
  defaults: CountUpOptions = {
    startVal: 0,
    decimals: 0,
    duration: 2,
    useEasing: true,
    useGrouping: true,
    autoSmoothThreshold: 999,
    smoothAmount: 100,
    separator: ',',
    decimal: '.',
    easingFn: this.easeOutExpo,
    formattingFn: this.formatNumber,
    prefix: '',
    suffix: ''
  };
  el: HTMLElement | HTMLInputElement;
  rAF: any;
  error = '';
  startVal = 0;
  duration = 0;
  countDown = false;
  paused = false;
  frameVal: number;
  startTime: number;
  decimalMult: number;
  timestamp: number;
  remaining: number;
  internalCallback: (args?: any) => void;
  callback: (args?: any) => void;

  constructor(
    private target: string | HTMLElement | HTMLInputElement,
    private endVal: number,
    private options: CountUpOptions
  ) {
    this.options = {
      ...this.defaults,
      ...options
    };
    this.el = (typeof target === 'string') ? document.getElementById(target) : target;
    if (!this.el) {
      this.error = '[CountUp] target is null or undefined';
    }
    this.options.decimals = Math.max(0 || this.options.decimals);
    this.decimalMult = Math.pow(10, this.options.decimals);
    this.duration = Number(this.options.duration) * 1000;
    this.startVal = this.validateValue(this.options.startVal);
    this.endVal = this.validateValue(endVal);
    if (this.startVal) {
      this.printValue(this.startVal);
    }

    // auto-smooth large numbers
    if (this.endVal > this.options.autoSmoothThreshold) {
      const up = (this.endVal > this.startVal) ? -1 : 1;
      this.startVal = this.frameVal;
      // this.endVal = this.endVal + (up * 100)
      // countUp = new CountUp(this.el.nativeElement, start, this.endVal + (up * 100), decimals, duration / 2, this.options);
    }
  }

  validateValue(value: number): number {
    const newValue = Number(value);
    if (!this.ensureNumber(newValue)) {
      this.error = `[CountUp] invalid start or end value: ${value}`;
      return null;
    } else {
      this.countDown = (this.options.startVal > newValue);
      return newValue;
    }
  }

  // start animation
  start = function(callback) {
    if (this.error) {
      return;
    }
    this.callback = callback;
    this.rAF = requestAnimationFrame(this.count);
  };

  // pause/resume animation
  pauseResume = function () {
    if (!this.paused) {
      this.paused = true;
      cancelAnimationFrame(this.rAF);
    } else {
      this.paused = false;
      this.startTime = null;
      this.duration = this.remaining;
      this.startVal = this.frameVal;
      this.start();
    }
  };

  // reset to startVal so animation can be run again
  reset = function () {
    this.paused = false;
    this.startTime = null;
    cancelAnimationFrame(this.rAF);
    this.printValue(this.startVal);
  };
  // pass a new endVal and start animation
  update = function (newEndVal) {
    this.endVal = this.validateValue(newEndVal);
    if (this.endVal === this.frameVal) {
      return;
    }
    cancelAnimationFrame(this.rAF);
    this.error = '';
    this.paused = false;
    this.startTime = null;
    this.startVal = this.frameVal;
    this.start();
  };

  count(timestamp: number) {

    if (!this.startTime) { this.startTime = timestamp; }

    this.timestamp = timestamp;
    const progress = timestamp - this.startTime;
    this.remaining = this.duration - progress;

    // to ease or not to ease
    if (this.options.useEasing) {
      if (this.countDown) {
        this.frameVal = this.startVal - this.options.easingFn(progress, 0, this.startVal - this.endVal, this.duration);
      } else {
        this.frameVal = this.options.easingFn(progress, this.startVal, this.endVal - this.startVal, this.duration);
      }
    } else {
      if (this.countDown) {
        this.frameVal = this.startVal - ((this.startVal - this.endVal) * (progress / this.duration));
      } else {
        this.frameVal = this.startVal + (this.endVal - this.startVal) * (progress / this.duration);
      }
    }

    // don't go past endVal since progress can exceed duration in the last frame
    if (this.countDown) {
      this.frameVal = (this.frameVal < this.endVal) ? this.endVal : this.frameVal;
    } else {
      this.frameVal = (this.frameVal > this.endVal) ? this.endVal : this.frameVal;
    }

    // decimal
    this.frameVal = Math.round(this.frameVal * this.decimalMult) / this.decimalMult;

    // format and print value
    this.printValue(this.frameVal);

    // whether to continue
    if (progress < this.duration) {
      this.rAF = requestAnimationFrame(this.count);
    } else {
      if (this.callback) {
        this.callback();
      }
    }
  }

  easeOutExpo(t: number, b: number, c: number, d: number) {
    return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
  }

  formatNumber(num: number): string {
    const neg = (num < 0) ? '-' : '';
    let result: string,
      x: string[],
      x1: string,
      x2: string,
      x3: string;
    result = Math.abs(num).toFixed(this.options.decimals);
    result += '';
    x = result.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? this.options.decimal + x[1] : '';
    if (this.options.useGrouping) {
      x3 = '';
      for (let i = 0, len = x1.length; i < len; ++i) {
        if (i !== 0 && ((i % 3) === 0)) {
          x3 = this.options.separator + x3;
        }
        x3 = x1[len - i - 1] + x3;
      }
      x1 = x3;
    }
    return neg + this.options.prefix + x1 + x2 + this.options.suffix;
  }

  printValue(val: number) {
    const result = this.options.formattingFn(val);

    if (this.el.tagName === 'INPUT') {
      const input = this.el as HTMLInputElement;
      input.value = result;
    } else if (this.el.tagName === 'text' || this.el.tagName === 'tspan') {
      this.el.textContent = result;
    } else {
      this.el.innerHTML = result;
    }
  }

  ensureNumber(n: any) {
    return (typeof n === 'number' && !isNaN(n));
  }
}
