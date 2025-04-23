export interface CountUpOptions { // (default)
  startVal?: number; // number to start at (0)
  decimalPlaces?: number; // number of decimal places (0)
  duration?: number; // animation duration in seconds (2)
  useGrouping?: boolean; // example: 1,000 vs 1000 (true)
  useIndianSeparators?: boolean; // example: 1,00,000 vs 100,000 (false)
  useEasing?: boolean; // ease animation (true)
  smartEasingThreshold?: number; // smooth easing for large numbers above this if useEasing (999)
  smartEasingAmount?: number; // amount to be eased for numbers above threshold (333)
  separator?: string; // grouping separator (,)
  decimal?: string; // decimal (.)
  // easingFn: easing function for animation (easeOutExpo)
  easingFn?: (t: number, b: number, c: number, d: number) => number;
  formattingFn?: (n: number) => string; // this function formats result
  prefix?: string; // text prepended to result
  suffix?: string; // text appended to result
  numerals?: string[]; // numeral glyph substitution
  enableScrollSpy?: boolean; // start animation when target is in view
  scrollSpyDelay?: number; // delay (ms) after target comes into view
  scrollSpyOnce?: boolean; // run only once
  onCompleteCallback?: () => any; // gets called when animation completes
  onStartCallback?: () => any; // gets called when animation starts
  plugin?: CountUpPlugin; // for alternate animations
}

export declare interface CountUpPlugin {
  render(elem: HTMLElement, formatted: string): void;
}

// playground: stackblitz.com/edit/countup-typescript
export class CountUp {

  version = '2.8.1';
  private defaults: CountUpOptions = {
    startVal: 0,
    decimalPlaces: 0,
    duration: 2,
    useEasing: true,
    useGrouping: true,
    useIndianSeparators: false,
    smartEasingThreshold: 999,
    smartEasingAmount: 333,
    separator: ',',
    decimal: '.',
    prefix: '',
    suffix: '',
    enableScrollSpy: false,
    scrollSpyDelay: 200,
    scrollSpyOnce: false,
  };
  private rAF: any;
  private startTime: number;
  private remaining: number;
  private finalEndVal: number = null; // for smart easing
  private useEasing = true;
  private countDown = false;
  el: HTMLElement | HTMLInputElement;
  formattingFn: (num: number) => string;
  easingFn?: (t: number, b: number, c: number, d: number) => number;
  error = '';
  startVal = 0;
  duration: number;
  paused = true;
  frameVal: number;
  once = false;

  constructor(
    target: string | HTMLElement | HTMLInputElement,
    private endVal: number,
    public options?: CountUpOptions
  ) {
    this.options = {
      ...this.defaults,
      ...options
    };
    this.formattingFn = (this.options.formattingFn) ?
      this.options.formattingFn : this.formatNumber;
    this.easingFn = (this.options.easingFn) ?
      this.options.easingFn : this.easeOutExpo;

    this.startVal = this.validateValue(this.options.startVal);
    this.frameVal = this.startVal;
    this.endVal = this.validateValue(endVal);
    this.options.decimalPlaces = Math.max(0 || this.options.decimalPlaces);
    this.resetDuration();
    this.options.separator = String(this.options.separator);
    this.useEasing = this.options.useEasing;
    if (this.options.separator === '') {
      this.options.useGrouping = false;
    }
    this.el = (typeof target === 'string') ? document.getElementById(target) : target;
    if (this.el) {
      this.printValue(this.startVal);
    } else {
      this.error = '[CountUp] target is null or undefined';
    }

    // scroll spy
    if (typeof window !== 'undefined' && this.options.enableScrollSpy) {
      if (!this.error) {
        // set up global array of onscroll functions to handle multiple instances
        window['onScrollFns'] = window['onScrollFns'] || [];
        window['onScrollFns'].push(() => this.handleScroll(this));
        window.onscroll = () => {
          window['onScrollFns'].forEach((fn) => fn());
        };
        this.handleScroll(this);
      } else {
        console.error(this.error, target);
      }
    }
  }

  handleScroll(self: CountUp): void {
    if (!self || !window || self.once) return;
    const bottomOfScroll = window.innerHeight +  window.scrollY;
    const rect = self.el.getBoundingClientRect();
    const topOfEl = rect.top + window.pageYOffset;
    const bottomOfEl = rect.top + rect.height + window.pageYOffset;
    if (bottomOfEl < bottomOfScroll && bottomOfEl >  window.scrollY && self.paused) {
      // in view
      self.paused = false;
      setTimeout(() => self.start(), self.options.scrollSpyDelay);
      if (self.options.scrollSpyOnce)
        self.once = true;
    } else if (
        (window.scrollY > bottomOfEl || topOfEl > bottomOfScroll) &&
        !self.paused
      ) {
      // out of view
      self.reset();
    }
  }

  /**
   * Smart easing works by breaking the animation into 2 parts, the second part being the
   * smartEasingAmount and first part being the total amount minus the smartEasingAmount. It works
   * by disabling easing for the first part and enabling it on the second part. It is used if
   * useEasing is true and the total animation amount exceeds the smartEasingThreshold.
   */
  private determineDirectionAndSmartEasing(): void {
    const end = (this.finalEndVal) ? this.finalEndVal : this.endVal;
    this.countDown = (this.startVal > end);
    const animateAmount = end - this.startVal;
    if (Math.abs(animateAmount) > this.options.smartEasingThreshold && this.options.useEasing) {
      this.finalEndVal = end;
      const up = (this.countDown) ? 1 : -1;
      this.endVal = end + (up * this.options.smartEasingAmount);
      this.duration = this.duration / 2;
    } else {
      this.endVal = end;
      this.finalEndVal = null;
    }
    if (this.finalEndVal !== null) {
      // setting finalEndVal indicates smart easing
      this.useEasing = false;
    } else {
      this.useEasing = this.options.useEasing;
    }
  }

  // start animation
  start(callback?: (args?: any) => any): void {
    if (this.error) {
      return;
    }
    if (this.options.onStartCallback) {
      this.options.onStartCallback();
    }
    if (callback) {
      this.options.onCompleteCallback = callback;
    }
    if (this.duration > 0) {
      this.determineDirectionAndSmartEasing();
      this.paused = false;
      this.rAF = requestAnimationFrame(this.count);
    } else {
      this.printValue(this.endVal);
    }
  }

  // pause/resume animation
  pauseResume(): void {
    if (!this.paused) {
      cancelAnimationFrame(this.rAF);
    } else {
      this.startTime = null;
      this.duration = this.remaining;
      this.startVal = this.frameVal;
      this.determineDirectionAndSmartEasing();
      this.rAF = requestAnimationFrame(this.count);
    }
    this.paused = !this.paused;
  }

  // reset to startVal so animation can be run again
  reset(): void {
    cancelAnimationFrame(this.rAF);
    this.paused = true;
    this.resetDuration();
    this.startVal = this.validateValue(this.options.startVal);
    this.frameVal = this.startVal;
    this.printValue(this.startVal);
  }

  // pass a new endVal and start animation
  update(newEndVal: string | number): void {
    cancelAnimationFrame(this.rAF);
    this.startTime = null;
    this.endVal = this.validateValue(newEndVal);
    if (this.endVal === this.frameVal) {
      return;
    }
    this.startVal = this.frameVal;
    if (this.finalEndVal == null) {
      this.resetDuration();
    }
    this.finalEndVal = null;
    this.determineDirectionAndSmartEasing();
    this.rAF = requestAnimationFrame(this.count);
  }

  count = (timestamp: number): void => {
    if (!this.startTime) { this.startTime = timestamp; }

    const progress = timestamp - this.startTime;
    this.remaining = this.duration - progress;

    // to ease or not to ease
    if (this.useEasing) {
      if (this.countDown) {
        this.frameVal = this.startVal - this.easingFn(progress, 0, this.startVal - this.endVal, this.duration);
      } else {
        this.frameVal = this.easingFn(progress, this.startVal, this.endVal - this.startVal, this.duration);
      }
    } else {
      this.frameVal = this.startVal + (this.endVal - this.startVal) * (progress / this.duration);
    }

    // don't go past endVal since progress can exceed duration in the last frame
    const wentPast = this.countDown ? this.frameVal < this.endVal : this.frameVal > this.endVal;
    this.frameVal = wentPast ? this.endVal : this.frameVal;

    // decimal
    this.frameVal = Number(this.frameVal.toFixed(this.options.decimalPlaces));

    // format and print value
    this.printValue(this.frameVal);

    // whether to continue
    if (progress < this.duration) {
      this.rAF = requestAnimationFrame(this.count);
    } else if (this.finalEndVal !== null) {
      // smart easing
      this.update(this.finalEndVal);
    } else {
      if (this.options.onCompleteCallback) {
        this.options.onCompleteCallback();
      }
    }
  }

  printValue(val: number): void {
    if (!this.el) return;
    const result = this.formattingFn(val);
    if (this.options.plugin?.render) {
      this.options.plugin.render(this.el, result);
      return;
    }
    if (this.el.tagName === 'INPUT') {
      const input = this.el as HTMLInputElement;
      input.value = result;
    } else if (this.el.tagName === 'text' || this.el.tagName === 'tspan') {
      this.el.textContent = result;
    } else {
      this.el.innerHTML = result;
    }
  }

  ensureNumber(n: any): boolean {
    return (typeof n === 'number' && !isNaN(n));
  }

  validateValue(value: string | number): number {
    const newValue = Number(value);
    if (!this.ensureNumber(newValue)) {
      this.error = `[CountUp] invalid start or end value: ${value}`;
      return null;
    } else {
      return newValue;
    }
  }

  private resetDuration(): void {
    this.startTime = null;
    this.duration = Number(this.options.duration) * 1000;
    this.remaining = this.duration;
  }

  // default format and easing functions

  formatNumber = (num: number): string => {
    const neg = (num < 0) ? '-' : '';
    let result: string, x1: string, x2: string, x3: string;
    result = Math.abs(num).toFixed(this.options.decimalPlaces);
    result += '';
    const x = result.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? this.options.decimal + x[1] : '';
    if (this.options.useGrouping) {
      x3 = '';
      let factor = 3, j = 0;
      for (let i = 0, len = x1.length; i < len; ++i) {
        if (this.options.useIndianSeparators && i === 4) {
          factor = 2;
          j = 1;
        }
        if (i !== 0 && (j % factor) === 0) {
          x3 = this.options.separator + x3;
        }
        j++;
        x3 = x1[len - i - 1] + x3;
      }
      x1 = x3;
    }
    // optional numeral substitution
    if (this.options.numerals && this.options.numerals.length) {
      x1 = x1.replace(/[0-9]/g, (w) => this.options.numerals[+w]);
      x2 = x2.replace(/[0-9]/g, (w) => this.options.numerals[+w]);
    }
    return neg + this.options.prefix + x1 + x2 + this.options.suffix;
  }

  // t: current time, b: beginning value, c: change in value, d: duration
  easeOutExpo = (t: number, b: number, c: number, d: number): number =>
    c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;

}
