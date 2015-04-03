var countUp = (function(window, document) {
'use strict';
//var undefined;
/*

    countUp.js
    by @inorganik

*/

// make sure requestAnimationFrame and cancelAnimationFrame are defined
// polyfill for browsers without native support
// by Opera engineer Erik Möller
var lastTime = 0,
    vendors = ['webkit', 'moz', 'ms', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}

var requestAnimationFrame = function(fn, thisArg) {
    return window.requestAnimationFrame(function(ts) { fn.call(thisArg, ts); });
};

// target = id of html element or var of previously selected html element where counting occurs
// startVal = the value you want to begin at
// endVal = the value you want to arrive at
// decimals = number of decimal places, default 0
// duration = duration of animation in seconds, default 2
// options = optional object of options (see below)
/**
 * @constructor
 */
var countUp = function (target, startVal, endVal, decimals, duration, options) {
     // default options
    this.options = options || {
        useEasing : true, // toggle easing
        useGrouping : true, // 1,000,000 vs 1000000
        separator : ',', // character to use as a separator
        decimal : '.', // character to use as a decimal
        startVal: startVal,
        endVal: endVal
    };
    if (this.options.separator === '')      { this.options.useGrouping = false; }
    if (this.options.prefix === undefined)  { this.options.prefix = ''; }
    if (this.options.suffix === undefined)  { this.options.suffix = ''; }

    //var self = this;
    this.d = (typeof target === 'string') ? document.getElementById(target) : target;
    this.startVal = Number(startVal);
    this.endVal = Number(endVal);

    this.countDown = (this.startVal > this.endVal) ? true : false;
    this.startTime = null;
    this.timestamp = null;
    this.remaining = null;
    this.frameVal = this.startVal;
    this.rAF = -1;
    this.decimals = Math.max(0, decimals || 0);
    this.callback = null;
    this.dec = Math.pow(10, this.decimals);
    this.duration = duration * 1000 || 2000;
};

    countUp.prototype.version = function () { return '1.3.3'; };

    // Print value to target
    countUp.prototype.printValue = function(value) {
        var result = (!isNaN(value)) ? this.numberFormatting(value) : '--';
        if (this.d.tagName == 'INPUT') {
            this.d.value = result;
        }
        else if (this.d.tagName == 'text') {
            this.d.textContent = result;
        }
        else {
            this.d.innerHTML = result;
        }
    };

    // Robert Penner's easeOutExpo
    countUp.prototype.easeOutExpo = function(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    };
    countUp.prototype.count = function(timestamp) {

        if (this.startTime === null) { this.startTime = timestamp; }

        this.timestamp = timestamp;

        var progress = this.timestamp - this.startTime;
        this.remaining = this.duration - progress;

        // to ease or not to ease
        if (this.options.useEasing) {
            if (this.countDown) {
                var i = this.easeOutExpo(progress, 0, this.startVal - this.endVal, this.duration);
                this.frameVal = this.startVal - i;
            } else {
                this.frameVal = this.easeOutExpo(progress, this.startVal, this.endVal - this.startVal, this.duration);
            }
        } else {
            if (this.countDown) {
                this.frameVal = this.startVal - (this.startVal - this.endVal) * (progress / this.duration);
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
        this.frameVal = Math.round(this.frameVal*this.dec)/this.dec;

        // format and print value
        this.printValue(this.frameVal);

        // whether to continue
        if (progress < this.duration) {
            this.rAF = requestAnimationFrame(this.count, this);
        } else if (this.callback) {
            this.callback();
        }
    };
    countUp.prototype.start = function(callbackFn) {
        this.callback = callbackFn;
        // make sure values are valid
        if (!isNaN(this.endVal) && !isNaN(this.startVal)) {
            this.rAF = requestAnimationFrame(this.count, this);
        } else {
            console.log('countUp error: startVal or endVal is not a number');
            this.printValue(this.startVal);
            this.printValue(this.endVal);
        }
        return false;
    };
    countUp.prototype.stop = function() {
        window.cancelAnimationFrame(this.rAF);
    };
    countUp.prototype.reset = function() {
        this.startTime = null;
        this.startVal = this.options.startVal;
        window.cancelAnimationFrame(this.rAF);
        this.printValue(this.startVal);
    };
    countUp.prototype.resume = function() {
        this.stop();
        this.startTime = null;
        this.duration = this.remaining;
        this.startVal = this.frameVal;
        requestAnimationFrame(this.count, this);
    };
    countUp.prototype.numberFormatting = function(nStr) {
        nStr = Number(nStr).toFixed(this.decimals).toString();
        var x, x1, x2, rgx;
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? this.options.decimal + x[1] : '';
        rgx = /(\d+)(\d{3})/;
        if (this.options.useGrouping) {
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + this.options.separator + '$2');
            }
        }
        return this.options.prefix + x1 + x2 + this.options.suffix;
    };
    countUp.prototype.update = function (newEndval) {
        this.stop();
        this.startTime = null;
        this.startVal = this.endVal;
        this.endVal = Number(newEndval);
        this.countDown = (this.startVal > this.endVal) ? true : false;
        this.rAF = requestAnimationFrame(this.count, this);
    };

    //Expose countUp as either a global variable or a require.js module.
    if(typeof define === 'function' && define.amd) {
        define([], function () {
            return countUp;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = countUp;
    } else {
        window.countUp = countUp;
    }
    return countUp;

// Example:
// var numAnim = new countUp("SomeElementYouWantToAnimate", 0, 99.99, 2, 2.5);
// numAnim.start();
// numAnim.update(135);
// with optional callback:
// numAnim.start(someMethodToCallOnComplete);
})(window, document);