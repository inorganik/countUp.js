(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var countUpModule = require('./dist/countUp.js');

window.onload = function () {
  var input = function (id) {
    return document.getElementById(id);
  };
  var code, stars, endVal, options;
  var demo = new countUpModule.CountUp('myTargetElement', 100);
  var codeVisualizer = document.getElementById('codeVisualizer');
  var errorSection = document.getElementById('errorSection');
  document.getElementById('version').innerHTML = demo.version;
  // HANDLERS
  input('startVal').onchange = updateCodeVisualizer;
  input('endVal').onchange = updateCodeVisualizer;
  input('decimalPlaces').onchange = updateCodeVisualizer;
  input('duration').onchange = updateCodeVisualizer;
  input('separator').onchange = updateCodeVisualizer;
  input('decimal').onchange = updateCodeVisualizer;
  input('prefix').onchange = updateCodeVisualizer;
  input('suffix').onchange = updateCodeVisualizer;
  input('useEasing').onclick = updateCodeVisualizer;
  input('useGrouping').onclick = updateCodeVisualizer;
  input('useOnComplete').onclick = updateCodeVisualizer;
  input('easingFnsDropdown').onchange = updateCodeVisualizer;
  input('numeralsDropdown').onchange = updateCodeVisualizer;
  document.getElementById('swapValues').onclick = function () {
    var oldStartVal = input('startVal').value;
    var oldEndVal = input('endVal').value;
    input('startVal').value = oldEndVal;
    input('endVal').value = oldStartVal;
    updateCodeVisualizer();
  };
  document.getElementById('start').onclick = createCountUp;
  document.getElementById('apply').onclick = createCountUp;
  document.getElementById('pauseResume').onclick = function () {
    code += '<br>demo.pauseResume();';
    codeVisualizer.innerHTML = code;
    demo.pauseResume();
  };
  document.getElementById('reset').onclick = function () {
    code += '<br>demo.reset();';
    codeVisualizer.innerHTML = code;
    demo.reset();
  };
  document.getElementById('update').onclick = function () {
    var updateVal = input('updateVal').value;
    var num = updateVal ? updateVal : 0;
    code += "<br>demo.update(" + num + ");";
    codeVisualizer.innerHTML = code;
    demo.update(num);
  };
  input('updateVal').onchange = function () {
    var updateVal = input('updateVal').value;
    var num = updateVal ? updateVal : 0;
    code += '<br>demo.update(' + num + ');';
    codeVisualizer.innerHTML = code;
  };
  // OPTION VALUES
  var easingFunctions = {
    easeOutExpo: function (t, b, c, d) {
      return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    },
    outQuintic: function (t, b, c, d) {
      var ts = (t /= d) * t;
      var tc = ts * t;
      return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
    },
    outCubic: function (t, b, c, d) {
      var ts = (t /= d) * t;
      var tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    }
  };
  function getEasingFn() {
    var fn = input('easingFnsDropdown').value;
    if (fn === 'easeOutExpo') {
      return null;
    }
    if (typeof easingFunctions[fn] === 'undefined') {
      return undefined;
    }
    return easingFunctions[fn];
  }
  function getEasingFnBody(fn) {
    fn = typeof fn === 'undefined' ? getEasingFn() : fn;
    if (typeof fn === 'undefined') {
      return 'undefined function';
    }
    if (fn !== null) {
      return fn.toString().replace(/^ {8}/gm, '');
    }
    return '';
  }
  function getNumerals() {
    var numeralsCode = input('numeralsDropdown').value;
    // optionally provide alternates for 0-9
    switch (numeralsCode) {
      case 'ea': // Eastern Arabic
        return ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      case 'fa': // Farsi
        return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      default:
        return null;
    }
  }
  var stringifyArray = function (arr) { return '[\'' + arr.join('\', \'') + '\']'; };
  // COUNTUP AND CODE VISUALIZER
  function createCountUp() {
    establishOptionsFromInputs();
    demo = new countUpModule.CountUp('myTargetElement', endVal, options);
    if (!demo.error) {
      errorSection.style.display = 'none';
      if (input('useOnComplete').checked) {
        demo.start(methodToCallOnComplete);
      }
      else {
        demo.start();
      }
      updateCodeVisualizer();
    }
    else {
      errorSection.style.display = 'block';
      document.getElementById('error').innerHTML = demo.error;
      console.error(demo.error);
    }
  }
  function methodToCallOnComplete() {
    console.log('COMPLETE!');
    alert('COMPLETE!');
  }
  function establishOptionsFromInputs() {
    endVal = Number(input('endVal').value);
    options = {
      startVal: input('startVal').value,
      decimalPlaces: input('decimalPlaces').value,
      duration: Number(input('duration').value),
      useEasing: input('useEasing').checked,
      useGrouping: input('useGrouping').checked,
      easingFn: typeof getEasingFn() === 'undefined' ? null : getEasingFn(),
      separator: input('separator').value,
      decimal: input('decimal').value,
      prefix: input('prefix').value,
      suffix: input('suffix').value,
      numerals: getNumerals()
    };
    // unset null values so they don't overwrite defaults
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        if (options[key] === null) {
          delete options[key];
        }
      }
    }
  }
  function updateCodeVisualizer() {
    establishOptionsFromInputs();
    code = '';
    if (options.useEasing && options.easingFn) {
      code += 'const easingFn = ';
      var split = getEasingFnBody(options.easingFn).split('\n');
      for (var line in split) {
        if (split.hasOwnProperty(line)) {
          code += split[line].replace(' ', '&nbsp;') + '<br>';
        }
      }
    }
    function indentedLine(keyPair, singleLine) {
      if (singleLine === void 0) { singleLine = false; }
      var delimeter = (singleLine) ? ';' : ',';
      return "&emsp;&emsp;" + keyPair + delimeter + "<br>";
    }
    var opts = '';
    opts += (options.startVal !== '0') ? indentedLine("startVal: " + options.startVal) : '';
    opts += (options.decimalPlaces !== '0') ? indentedLine("decimalPlaces: " + options.decimalPlaces) : '';
    opts += (options.duration !== 2) ? indentedLine("duration: " + options.duration) : '';
    opts += (options.useEasing) ? '' : indentedLine("useEasing: " + options.useEasing);
    opts += (options.useEasing && options.easingFn) ? indentedLine("easingFn") : '';
    opts += (options.useGrouping) ? '' : indentedLine("useGrouping: " + options.useGrouping);
    opts += (options.separator !== ',') ? indentedLine("separator: '" + options.separator + "'") : '';
    opts += (options.decimal !== '.') ? indentedLine("decimal: '" + options.decimal + "'") : '';
    opts += (options.prefix.length) ? indentedLine("prefix: '" + options.prefix + "'") : '';
    opts += (options.suffix.length) ? indentedLine("suffix: '" + options.suffix + "'") : '';
    opts += (options.numerals && options.numerals.length) ?
      indentedLine("numerals: '" + stringifyArray(options.numerals) + "'") : '';
    if (opts.length) {
      code += "const options = {<br>" + opts + "};<br>";
      code += "let demo = new CountUp('myTargetElement', " + endVal + ", options);<br>";
    }
    else {
      code += "let demo = new CountUp('myTargetElement', " + endVal + ");<br>";
    }
    code += 'if (!demo.error) {<br>';
    code += (input('useOnComplete').checked) ?
      indentedLine('demo.start(methodToCallOnComplete)', true) : indentedLine('demo.start()', true);
    code += '} else {<br>';
    code += indentedLine('console.error(demo.error)', true);
    code += '}';
    codeVisualizer.innerHTML = code;
  }
  // get current star count
  var repoInfoUrl = 'https://api.github.com/repos/inorganik/CountUp.js';
  var getStars = new XMLHttpRequest();
  getStars.open('GET', repoInfoUrl, true);
  getStars.timeout = 5000;
  getStars.onreadystatechange = function () {
    // 2: received headers,  3: loading, 4: done
    if (getStars.readyState === 4) {
      if (getStars.status === 200) {
        if (getStars.responseText !== 'undefined') {
          if (getStars.responseText.length > 0) {
            var data = JSON.parse(getStars.responseText);
            stars = data.stargazers_count;
            // change input values
            input('endVal').value = stars;
            createCountUp();
          }
        }
      }
    }
  };
  getStars.onerror = function () {
    console.error('error getting stars:', getStars.status);
    stars = getStars.status;
    demo.start();
  };
  getStars.send();
}

},{"./dist/countUp.js":2}],2:[function(require,module,exports){
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
// playground: stackblitz.com/edit/countup-typescript
var CountUp = /** @class */ (function () {
    function CountUp(target, endVal, options) {
        var _this = this;
        this.target = target;
        this.endVal = endVal;
        this.options = options;
        this.version = '2.0.3';
        this.defaults = {
            startVal: 0,
            decimalPlaces: 0,
            duration: 2,
            useEasing: true,
            useGrouping: true,
            smartEasingThreshold: 999,
            smartEasingAmount: 333,
            separator: ',',
            decimal: '.',
            prefix: '',
            suffix: ''
        };
        this.finalEndVal = null; // for smart easing
        this.useEasing = true;
        this.countDown = false;
        this.error = '';
        this.startVal = 0;
        this.paused = true;
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
                if (_this.countDown) {
                    _this.frameVal = _this.startVal - ((_this.startVal - _this.endVal) * (progress / _this.duration));
                }
                else {
                    _this.frameVal = _this.startVal + (_this.endVal - _this.startVal) * (progress / _this.duration);
                }
            }
            // don't go past endVal since progress can exceed duration in the last frame
            if (_this.countDown) {
                _this.frameVal = (_this.frameVal < _this.endVal) ? _this.endVal : _this.frameVal;
            }
            else {
                _this.frameVal = (_this.frameVal > _this.endVal) ? _this.endVal : _this.frameVal;
            }
            // decimal
            _this.frameVal = Math.round(_this.frameVal * _this.decimalMult) / _this.decimalMult;
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
                if (_this.callback) {
                    _this.callback();
                }
            }
        };
        // default format and easing functions
        this.formatNumber = function (num) {
            var neg = (num < 0) ? '-' : '';
            var result, x, x1, x2, x3;
            result = Math.abs(num).toFixed(_this.options.decimalPlaces);
            result += '';
            x = result.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? _this.options.decimal + x[1] : '';
            if (_this.options.useGrouping) {
                x3 = '';
                for (var i = 0, len = x1.length; i < len; ++i) {
                    if (i !== 0 && (i % 3) === 0) {
                        x3 = _this.options.separator + x3;
                    }
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
        this.easeOutExpo = function (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
        };
        this.options = __assign({}, this.defaults, options);
        this.formattingFn = (this.options.formattingFn) ?
            this.options.formattingFn : this.formatNumber;
        this.easingFn = (this.options.easingFn) ?
            this.options.easingFn : this.easeOutExpo;
        this.startVal = this.validateValue(this.options.startVal);
        this.frameVal = this.startVal;
        this.endVal = this.validateValue(endVal);
        this.options.decimalPlaces = Math.max(0 || this.options.decimalPlaces);
        this.decimalMult = Math.pow(10, this.options.decimalPlaces);
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
    }
    // determines where easing starts and whether to count down or up
    CountUp.prototype.determineDirectionAndSmartEasing = function () {
        var end = (this.finalEndVal) ? this.finalEndVal : this.endVal;
        this.countDown = (this.startVal > end);
        var animateAmount = end - this.startVal;
        if (Math.abs(animateAmount) > this.options.smartEasingThreshold) {
            this.finalEndVal = end;
            var up = (this.countDown) ? 1 : -1;
            this.endVal = end + (up * this.options.smartEasingAmount);
            this.duration = this.duration / 2;
        }
        else {
            this.endVal = end;
            this.finalEndVal = null;
        }
        if (this.finalEndVal) {
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
        this.callback = callback;
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
        if (!this.finalEndVal) {
            this.resetDuration();
        }
        this.determineDirectionAndSmartEasing();
        this.rAF = requestAnimationFrame(this.count);
    };
    CountUp.prototype.printValue = function (val) {
        var result = this.formattingFn(val);
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

},{}]},{},[1]);
