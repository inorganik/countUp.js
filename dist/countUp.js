"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var CountUp = /** @class */ (function () {
    function CountUp(target, endVal, options) {
        this.target = target;
        this.endVal = endVal;
        this.options = options;
        this.version = '2.0.0';
        this.defaults = {
            startVal: 0,
            decimals: 0,
            duration: 2,
            useEasing: true,
            useGrouping: true,
            autoSmoothThreshold: 999,
            autoSmoothAmount: 100,
            separator: ',',
            decimal: '.',
            easingFn: this.easeOutExpo,
            formattingFn: this.formatNumber,
            prefix: '',
            suffix: ''
        };
        this.error = '';
        this.startVal = 0;
        this.duration = 0;
        this.countDown = false;
        this.paused = false;
        this.options = __assign({}, this.defaults, options);
        this.el = (typeof target === 'string') ? document.getElementById(target) : target;
        if (!this.el) {
            this.error = '[CountUp] target is null or undefined';
        }
        this.options.decimals = Math.max(0 || this.options.decimals);
        this.decimalMult = Math.pow(10, this.options.decimals);
        this.duration = Number(this.options.duration) * 1000;
        this.startVal = this.validateValue(this.options.startVal);
        this.endVal = this.validateValue(endVal);
        this.options.separator = String(this.options.separator);
        if (this.options.separator === '') {
            this.options.useGrouping = false;
        }
        if (this.startVal) {
            this.printValue(this.startVal);
        }
    }
    // start animation
    CountUp.prototype.start = function (callback) {
        if (this.error) {
            return;
        }
        this.callback = callback;
        // auto-smooth large numbers
        if (this.endVal > this.options.autoSmoothThreshold) {
            this.finalEndVal = this.endVal;
            var up = (this.endVal > this.startVal) ? -1 : 1;
            this.endVal = this.endVal + (up * 100);
            this.duration = this.duration / 2;
        }
        this.rAF = requestAnimationFrame(this.count);
    };
    // pause/resume animation
    CountUp.prototype.pauseResume = function () {
        if (!this.paused) {
            this.paused = true;
            cancelAnimationFrame(this.rAF);
        }
        else {
            this.paused = false;
            this.startTime = null;
            this.duration = this.remaining;
            this.startVal = this.frameVal;
            this.start();
        }
    };
    // reset to startVal so animation can be run again
    CountUp.prototype.reset = function () {
        this.paused = false;
        this.startTime = null;
        this.finalEndVal = null;
        cancelAnimationFrame(this.rAF);
        this.printValue(this.startVal);
    };
    // pass a new endVal and start animation
    CountUp.prototype.update = function (newEndVal) {
        this.endVal = this.validateValue(newEndVal);
        this.finalEndVal = null;
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
    CountUp.prototype.count = function (timestamp) {
        if (!this.startTime) {
            this.startTime = timestamp;
        }
        this.timestamp = timestamp;
        var progress = timestamp - this.startTime;
        this.remaining = this.duration - progress;
        // to ease or not to ease
        if (this.options.useEasing) {
            if (this.countDown) {
                this.frameVal = this.startVal - this.options.easingFn(progress, 0, this.startVal - this.endVal, this.duration);
            }
            else {
                this.frameVal = this.options.easingFn(progress, this.startVal, this.endVal - this.startVal, this.duration);
            }
        }
        else {
            if (this.countDown) {
                this.frameVal = this.startVal - ((this.startVal - this.endVal) * (progress / this.duration));
            }
            else {
                this.frameVal = this.startVal + (this.endVal - this.startVal) * (progress / this.duration);
            }
        }
        // don't go past endVal since progress can exceed duration in the last frame
        if (this.countDown) {
            this.frameVal = (this.frameVal < this.endVal) ? this.endVal : this.frameVal;
        }
        else {
            this.frameVal = (this.frameVal > this.endVal) ? this.endVal : this.frameVal;
        }
        // decimal
        this.frameVal = Math.round(this.frameVal * this.decimalMult) / this.decimalMult;
        // format and print value
        this.printValue(this.frameVal);
        // whether to continue
        if (progress < this.duration) {
            this.rAF = requestAnimationFrame(this.count);
        }
        else if (this.finalEndVal) {
            // for auto-smoothing
            this.update(this.finalEndVal);
        }
        else {
            if (this.callback) {
                this.callback();
            }
        }
    };
    CountUp.prototype.easeOutExpo = function (t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    };
    CountUp.prototype.formatNumber = function (num) {
        var _this = this;
        var neg = (num < 0) ? '-' : '';
        var result, x, x1, x2, x3;
        result = Math.abs(num).toFixed(this.options.decimals);
        result += '';
        x = result.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? this.options.decimal + x[1] : '';
        if (this.options.useGrouping) {
            x3 = '';
            for (var i = 0, len = x1.length; i < len; ++i) {
                if (i !== 0 && (i % 3) === 0) {
                    x3 = this.options.separator + x3;
                }
                x3 = x1[len - i - 1] + x3;
            }
            x1 = x3;
        }
        // optional numeral substitution
        if (this.options.numerals && this.options.numerals.length) {
            x1 = x1.replace(/[0-9]/g, function (w) { return _this.options.numerals[+w]; });
            x2 = x2.replace(/[0-9]/g, function (w) { return _this.options.numerals[+w]; });
        }
        return neg + this.options.prefix + x1 + x2 + this.options.suffix;
    };
    CountUp.prototype.printValue = function (val) {
        var result = this.options.formattingFn(val);
        if (this.el.tagName === 'INPUT') {
            var input = this.el;
            input.value = result;
        }
        else if (this.el.tagName === 'text' || this.el.tagName === 'tspan') {
            this.el.textContent = result;
        }
        else {
            this.el.innerHTML = result;
        }
    };
    CountUp.prototype.ensureNumber = function (n) {
        return (typeof n === 'number' && !isNaN(n));
    };
    CountUp.prototype.validateValue = function (value) {
        var newValue = Number(value);
        if (!this.ensureNumber(newValue)) {
            this.error = "[CountUp] invalid start or end value: " + value;
            return null;
        }
        else {
            this.countDown = (this.options.startVal > newValue);
            return newValue;
        }
    };
    return CountUp;
}());
exports.CountUp = CountUp;
