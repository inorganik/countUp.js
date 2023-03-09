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
  flaps?: boolean; // digits are flaps thanks to Marcel Soler
  flapDuration?: number; // flap animation in seconds,
  flapDelay?: number; // delay last digit in animation, in seconds, 0 to deactivate
}

// playground: stackblitz.com/edit/countup-typescript
export class CountUp {

  version = '2.5.0';
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
    // Marcel Soler
    flaps: false,
    flapDuration: 0.8,
    flapDelay: 0.25,
  };
  private el: HTMLElement | HTMLInputElement;
  private rAF: any;
  private startTime: number;
  private remaining: number;
  private finalEndVal: number = null; // for smart easing
  private useEasing = true;
  private countDown = false;
  private cells_flaps: any = null;
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
    const topOfEl = rect.top + window.pageYOffset
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
   * usingEasing is true and the total animation amount exceeds the smartEasingThreshold.
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

  // Marcel Soler
  printFlaps(result: string) {
    var createdNow = false
    if (!this.cells_flaps) {
      createdNow = true
      // avoid adding more than once
      if (!document.querySelector('style[flap]')) {
        // add styles for flap numbers
        var style = document.createElement('style');
        style.setAttribute('flap', 'flap');
        style.innerHTML = `
          .flap-numbers{display: inline-flex; line-height: 100%;overflow-y: hidden;}
          .flap-numbers > span{display: flex; flex-direction:column;justify-content: start; align-items: center; height: 1em; will-change: transform; transform: translateY(0)}
          `;
        document.head.appendChild(style);
      }
      // create wrapper
      this.el.innerHTML = '<div class="flap-numbers"></div>';
      // create array cells_flaps information
      this.cells_flaps = [];
    }

    //blank space
    const blank = '<span style="color:transparent">0</span>';
    const transitionFlap = `transform ${this.options.flapDuration}s ease-out`;

    // appearing new cells_flaps
    for (var i = this.cells_flaps.length; i < result.length; i++) {
      // create a container
      const container = document.createElement('span');
      container.style.transition = transitionFlap;
      // add a first transparent cell
      container.innerHTML = createdNow?'':blank;
      this.el.firstChild.appendChild(container);
      // prepare data id cell
      this.cells_flaps.push({
        container,
        current: undefined,
        position: createdNow?1:0,
        new: true,
      });
    }

    function appendDigit(cell, newDigit) {

      cell.position--;
      cell.container.appendChild(newDigit);
      cell.lastTimeAdd = +new Date();

      // we need to stablish transition at first number, using timeout
      if (cell.new) {
        cell.new = false;
        requestAnimationFrame(function () {
          cell.container.style.transform = `translateY(${cell.position}em)`;
        });
      } else cell.container.style.transform = `translateY(${cell.position}em)`;
    }

    function pushDigit(cell: any, newDigit: any, options: CountUpOptions) {
      // if there was another cell waiting to be added, we add it here
      if (cell.nextToAdd) {
        appendDigit(cell, cell.nextToAdd);
        clearTimeout(cell.lastTimer);
        cell.nextToAdd = null;
      }

      const now = +new Date();
      const delayTime = options.flapDelay * 1000 - (now - cell.lastTimeAdd);

      // if we are in slow animation, we just add digit
      if (
        options.flapDelay <= 0 ||
        now - cell.lastTimeAdd >= delayTime * 1.05
      ) {
        appendDigit(cell, newDigit);
        cell.nextToAdd = null;
      } else {
        // if not, we delay the push
        cell.nextToAdd = newDigit;
        cell.lastTimer = setTimeout(() => {
          appendDigit(cell, cell.nextToAdd);
          cell.nextToAdd = null;
        }, options.flapDuration * 1000);
      }
    }

    // we add all sequence cells_flaps that are new in result
    // or remove cells no more exist (we put blank cells)
    const len = Math.max(result.length, this.cells_flaps.length);
    for (var i: any = 0; i < len; i++) {
      // cell has changed
      var ch = i < result.length ? result.charAt(i) : null;
      const cell = this.cells_flaps[i];
      if (cell.current != ch) {
        cell.current = ch;

        var newDigit = document.createElement('span');
        newDigit.innerHTML = ch === null ? blank : ch;

        // the last delay animation only if there is a minimum of 3 elements
        if (cell.container.children.length < 4) {
          appendDigit(cell, newDigit);
        } else {
          pushDigit(cell, newDigit, this.options);
        }

        clearTimeout(cell.timerClean);
        // when animation end, we can remove all extra animated cells
        cell.timerClean = setTimeout(function () {
          cell.timerClean = null;
          if (cell.container.children.length < 3) return;
          cell.container.style.transition = 'none'; // temporally clear animation transition
          requestAnimationFrame(() => {
            cell.position = -1;
            // we remove all childs except last
            while (cell.container.children.length > 1)
              cell.container.removeChild(cell.container.firstChild);
            //insert blank space (forcing width to avoid weird behaviour in comma)
            const digitBlank = document.createElement('span');
            digitBlank.innerHTML = blank;
            cell.container.insertBefore(digitBlank, cell.container.firstChild);
            // set scroll to last cell position
            cell.container.style.transform = `translateY(${cell.position}em)`;
            requestAnimationFrame(() => {
              cell.container.style.transition = transitionFlap; // restart animation transition
            });
          });
        }, this.options.flapDuration * 1000 * 3);
      }
    }
  }
  
  printValue(val: number): void {
    const result = this.formattingFn(val);
    if (!this.el) return;
    if (this.options.flaps) {
      this.printFlaps(result);
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