(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.countUp = {}));
})(this, (function (exports) { 'use strict';

    var __assign = (undefined && undefined.__assign) || function () {
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
    // playground: stackblitz.com/edit/countup-typescript
    var CountUp = /** @class */ (function () {
        function CountUp(target, endVal, options) {
            var _this = this;
            this.endVal = endVal;
            this.options = options;
            this.version = '2.5.0';
            this.defaults = {
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
            this.finalEndVal = null; // for smart easing
            this.useEasing = true;
            this.countDown = false;
            this.cells_flaps = null;
            this.error = '';
            this.startVal = 0;
            this.paused = true;
            this.once = false;
            this.count = function (timestamp) {
                if (!_this.startTime) {
                    _this.startTime = timestamp;
                }
                var progress = timestamp - _this.startTime;
                _this.remaining = _this.duration - progress;
                // to ease or not to ease
                if (_this.useEasing) {
                    if (_this.countDown) {
                        _this.frameVal = _this.startVal - _this.easingFn(progress, 0, _this.startVal - _this.endVal, _this.duration);
                    }
                    else {
                        _this.frameVal = _this.easingFn(progress, _this.startVal, _this.endVal - _this.startVal, _this.duration);
                    }
                }
                else {
                    _this.frameVal = _this.startVal + (_this.endVal - _this.startVal) * (progress / _this.duration);
                }
                // don't go past endVal since progress can exceed duration in the last frame
                var wentPast = _this.countDown ? _this.frameVal < _this.endVal : _this.frameVal > _this.endVal;
                _this.frameVal = wentPast ? _this.endVal : _this.frameVal;
                // decimal
                _this.frameVal = Number(_this.frameVal.toFixed(_this.options.decimalPlaces));
                // format and print value
                _this.printValue(_this.frameVal);
                // whether to continue
                if (progress < _this.duration) {
                    _this.rAF = requestAnimationFrame(_this.count);
                }
                else if (_this.finalEndVal !== null) {
                    // smart easing
                    _this.update(_this.finalEndVal);
                }
                else {
                    if (_this.options.onCompleteCallback) {
                        _this.options.onCompleteCallback();
                    }
                }
            };
            // default format and easing functions
            this.formatNumber = function (num) {
                var neg = (num < 0) ? '-' : '';
                var result, x1, x2, x3;
                result = Math.abs(num).toFixed(_this.options.decimalPlaces);
                result += '';
                var x = result.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? _this.options.decimal + x[1] : '';
                if (_this.options.useGrouping) {
                    x3 = '';
                    var factor = 3, j = 0;
                    for (var i = 0, len = x1.length; i < len; ++i) {
                        if (_this.options.useIndianSeparators && i === 4) {
                            factor = 2;
                            j = 1;
                        }
                        if (i !== 0 && (j % factor) === 0) {
                            x3 = _this.options.separator + x3;
                        }
                        j++;
                        x3 = x1[len - i - 1] + x3;
                    }
                    x1 = x3;
                }
                // optional numeral substitution
                if (_this.options.numerals && _this.options.numerals.length) {
                    x1 = x1.replace(/[0-9]/g, function (w) { return _this.options.numerals[+w]; });
                    x2 = x2.replace(/[0-9]/g, function (w) { return _this.options.numerals[+w]; });
                }
                return neg + _this.options.prefix + x1 + x2 + _this.options.suffix;
            };
            // t: current time, b: beginning value, c: change in value, d: duration
            this.easeOutExpo = function (t, b, c, d) {
                return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
            };
            this.options = __assign(__assign({}, this.defaults), options);
            this.formattingFn = (this.options.formattingFn) ?
                this.options.formattingFn : this.formatNumber;
            this.easingFn = (this.options.easingFn) ?
                this.options.easingFn : this.easeOutExpo;
            this.startVal = this.validateValue(this.options.startVal);
            this.frameVal = this.startVal;
            this.endVal = this.validateValue(endVal);
            this.options.decimalPlaces = Math.max(this.options.decimalPlaces);
            this.resetDuration();
            this.options.separator = String(this.options.separator);
            this.useEasing = this.options.useEasing;
            if (this.options.separator === '') {
                this.options.useGrouping = false;
            }
            this.el = (typeof target === 'string') ? document.getElementById(target) : target;
            if (this.el) {
                this.printValue(this.startVal);
            }
            else {
                this.error = '[CountUp] target is null or undefined';
            }
            // scroll spy
            if (typeof window !== 'undefined' && this.options.enableScrollSpy) {
                if (!this.error) {
                    // set up global array of onscroll functions to handle multiple instances
                    window['onScrollFns'] = window['onScrollFns'] || [];
                    window['onScrollFns'].push(function () { return _this.handleScroll(_this); });
                    window.onscroll = function () {
                        window['onScrollFns'].forEach(function (fn) { return fn(); });
                    };
                    this.handleScroll(this);
                }
                else {
                    console.error(this.error, target);
                }
            }
        }
        CountUp.prototype.handleScroll = function (self) {
            if (!self || !window || self.once)
                return;
            var bottomOfScroll = window.innerHeight + window.scrollY;
            var rect = self.el.getBoundingClientRect();
            var topOfEl = rect.top + window.pageYOffset;
            var bottomOfEl = rect.top + rect.height + window.pageYOffset;
            if (bottomOfEl < bottomOfScroll && bottomOfEl > window.scrollY && self.paused) {
                // in view
                self.paused = false;
                setTimeout(function () { return self.start(); }, self.options.scrollSpyDelay);
                if (self.options.scrollSpyOnce)
                    self.once = true;
            }
            else if ((window.scrollY > bottomOfEl || topOfEl > bottomOfScroll) &&
                !self.paused) {
                // out of view
                self.reset();
            }
        };
        /**
         * Smart easing works by breaking the animation into 2 parts, the second part being the
         * smartEasingAmount and first part being the total amount minus the smartEasingAmount. It works
         * by disabling easing for the first part and enabling it on the second part. It is used if
         * usingEasing is true and the total animation amount exceeds the smartEasingThreshold.
         */
        CountUp.prototype.determineDirectionAndSmartEasing = function () {
            var end = (this.finalEndVal) ? this.finalEndVal : this.endVal;
            this.countDown = (this.startVal > end);
            var animateAmount = end - this.startVal;
            if (Math.abs(animateAmount) > this.options.smartEasingThreshold && this.options.useEasing) {
                this.finalEndVal = end;
                var up = (this.countDown) ? 1 : -1;
                this.endVal = end + (up * this.options.smartEasingAmount);
                this.duration = this.duration / 2;
            }
            else {
                this.endVal = end;
                this.finalEndVal = null;
            }
            if (this.finalEndVal !== null) {
                // setting finalEndVal indicates smart easing
                this.useEasing = false;
            }
            else {
                this.useEasing = this.options.useEasing;
            }
        };
        // start animation
        CountUp.prototype.start = function (callback) {
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
            }
            else {
                this.printValue(this.endVal);
            }
        };
        // pause/resume animation
        CountUp.prototype.pauseResume = function () {
            if (!this.paused) {
                cancelAnimationFrame(this.rAF);
            }
            else {
                this.startTime = null;
                this.duration = this.remaining;
                this.startVal = this.frameVal;
                this.determineDirectionAndSmartEasing();
                this.rAF = requestAnimationFrame(this.count);
            }
            this.paused = !this.paused;
        };
        // reset to startVal so animation can be run again
        CountUp.prototype.reset = function () {
            cancelAnimationFrame(this.rAF);
            this.paused = true;
            this.resetDuration();
            this.startVal = this.validateValue(this.options.startVal);
            this.frameVal = this.startVal;
            this.printValue(this.startVal);
        };
        // pass a new endVal and start animation
        CountUp.prototype.update = function (newEndVal) {
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
        };
        // Marcel Soler
        CountUp.prototype.printFlaps = function (result) {
            if (!this.cells_flaps) {
                // avoid adding more than once
                if (!document.querySelector('style[flap]')) {
                    // add styles for flap numbers
                    var style = document.createElement('style');
                    style.setAttribute('flap', 'flap');
                    style.innerHTML = "\n          .flap-numbers{display: inline-flex; line-height: 100%;overflow-y: hidden;}\n          .flap-numbers > span{display: flex; flex-direction:column;justify-content: start; align-items: center; height: 1em; will-change: transform; transform: translateY(0)}\n          ";
                    document.head.appendChild(style);
                }
                // create wrapper
                this.el.innerHTML = '<div class="flap-numbers"></div>';
                // create array cells_flaps information
                this.cells_flaps = [];
            }
            //blank space
            var blank = '<span style="color:transparent">0</span>';
            var transitionFlap = "transform ".concat(this.options.flapDuration, "s ease-out");
            // appearing new cells_flaps
            for (var i = this.cells_flaps.length; i < result.length; i++) {
                // create a container
                var container = document.createElement('span');
                container.style.transition = transitionFlap;
                // add a first transparent cell
                container.innerHTML = blank;
                this.el.firstChild.appendChild(container);
                // prepare data id cell
                this.cells_flaps.push({
                    container: container,
                    current: undefined,
                    position: 0,
                    new: true,
                });
            }
            function appendDigit(cell, newDigit) {
                console.log('appendDigit', newDigit);
                cell.position--;
                cell.container.appendChild(newDigit);
                cell.lastTimeAdd = +new Date();
                console.log('cell.position', cell.position, 'container.children', cell.container.children.length);
                // we need to stablish transition at first number, using timeout
                if (cell.new) {
                    cell.new = false;
                    requestAnimationFrame(function () {
                        cell.container.style.transform = "translateY(".concat(cell.position, "em)");
                    });
                }
                else
                    cell.container.style.transform = "translateY(".concat(cell.position, "em)");
            }
            function pushDigit(cell, newDigit, options) {
                console.log('pushDigit', newDigit);
                // if there was another cell waiting to be added, we add it here
                if (cell.nextToAdd) {
                    appendDigit(cell, cell.nextToAdd);
                    clearTimeout(cell.lastTimer);
                    cell.nextToAdd = null;
                }
                var now = +new Date();
                var delayTime = options.flapDelay * 1000 - (now - cell.lastTimeAdd);
                console.log('delayTime', delayTime);
                // if we are in slow animation, we just add digit
                if (options.flapDelay <= 0 ||
                    now - cell.lastTimeAdd >= delayTime * 1.05) {
                    appendDigit(cell, newDigit);
                    cell.nextToAdd = null;
                }
                else {
                    // if not, we delay the push
                    cell.nextToAdd = newDigit;
                    cell.lastTimer = setTimeout(function () {
                        console.log('addLast', cell.nextToAdd);
                        appendDigit(cell, cell.nextToAdd);
                        cell.nextToAdd = null;
                    }, options.flapDuration * 1000);
                }
            }
            // we add all sequence cells_flaps that are new in result
            // or remove cells no more exist (we put blank cells)
            var len = Math.max(result.length, this.cells_flaps.length);
            var _loop_1 = function () {
                // cell has changed
                ch = i < result.length ? result.charAt(i) : null;
                var cell = this_1.cells_flaps[i];
                if (cell.current != ch) {
                    console.log('new digit appear', ch);
                    cell.current = ch;
                    newDigit = document.createElement('span');
                    newDigit.innerHTML = ch === null ? blank : ch;
                    // the last delay animation only if there is a minimum of 3 elements
                    if (cell.container.children.length < 4) {
                        appendDigit(cell, newDigit);
                    }
                    else {
                        pushDigit(cell, newDigit, this_1.options);
                    }
                    clearTimeout(cell.timerClean);
                    // when animation end, we can remove all extra animated cells
                    cell.timerClean = setTimeout(function () {
                        console.log('clear digits');
                        cell.timerClean = null;
                        if (cell.container.children.length < 3)
                            return;
                        cell.container.style.transition = 'none'; // temporally clear animation transition
                        requestAnimationFrame(function () {
                            cell.position = -1;
                            // we remove all childs except last
                            while (cell.container.children.length > 1)
                                cell.container.removeChild(cell.container.firstChild);
                            //insert blank space (forcing width to avoid weird behaviour in comma)
                            var digitBlank = document.createElement('span');
                            digitBlank.innerHTML = blank;
                            cell.container.insertBefore(digitBlank, cell.container.firstChild);
                            // set scroll to last cell position
                            cell.container.style.transform = "translateY(".concat(cell.position, "em)");
                            requestAnimationFrame(function () {
                                cell.container.style.transition = transitionFlap; // restart animation transition
                            });
                        });
                    }, this_1.options.flapDuration * 1000 * 3);
                }
            };
            var this_1 = this, ch, newDigit;
            for (var i = 0; i < len; i++) {
                _loop_1();
            }
        };
        CountUp.prototype.printValue = function (val) {
            var result = this.formattingFn(val);
            if (!this.el)
                return;
            if (this.options.flaps) {
                this.printFlaps(result);
                return;
            }
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
                this.error = "[CountUp] invalid start or end value: ".concat(value);
                return null;
            }
            else {
                return newValue;
            }
        };
        CountUp.prototype.resetDuration = function () {
            this.startTime = null;
            this.duration = Number(this.options.duration) * 1000;
            this.remaining = this.duration;
        };
        return CountUp;
    }());

    exports.CountUp = CountUp;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
