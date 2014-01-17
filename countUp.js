/*

    countUp.js
    by @inorganik
    v 0.0.5

*/

// target = id of Html element where counting occurs
// startVal = the value you want to begin at
// endVal = the value you want to arrive at
// decimals = number of decimal places in number, default 0
// duration = duration in seconds, default 2

function countUp(target, startVal, endVal, decimals, duration) {
    
    // make sure requestAnimationFrame and cancelAnimationFrame are defined
    // polyfill for browsers without native support
    // by Opera engineer Erik Möller
    var lastTime = 0;
    var vendors = ['webkit', 'moz', 'ms'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        }
    }

    var self = this;
    
    this.d = document.getElementById(target);
    
    startVal = Number(startVal);
    endVal = Number(endVal);
    this.countDown = (startVal > endVal) ? true : false;
    
    // toggle easing
    this.useEasing = true;
    
    decimals = Math.max(0, decimals || 0);
    this.dec = Math.pow(10, decimals);
    this.duration = duration * 1000 || 2000;

    this.startTime = null;
    this.frameVal = startVal;

    this.rAF = null;
    
    // Robert Penner's easeOutExpo
    this.easeOutExpo = function(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    }
    this.count = function(timestamp) {
        
        if (self.startTime === null) self.startTime = timestamp;
     
        var progress = timestamp - self.startTime;
        
        // to ease or not to ease
        if (self.useEasing) {
            if (self.countDown) {
                var i = self.easeOutExpo(progress, 0, startVal - endVal, self.duration);
                self.frameVal = startVal - i;
            } else {
                self.frameVal = self.easeOutExpo(progress, startVal, endVal - startVal, self.duration);
            }
        } else {
            if (self.countDown) {
                var i = (startVal - endVal) * (progress / self.duration);
                self.frameVal = startVal - i;
            } else {
                self.frameVal = startVal + (endVal - startVal) * (progress / self.duration);
            }
        }
        
        // decimal
        self.frameVal = Math.round(self.frameVal*self.dec)/self.dec;
        
        // don't go past endVal since progress can exceed duration in the last frame
        if (self.countDown) {
            self.frameVal = (self.frameVal < endVal) ? endVal : self.frameVal;
        } else {
            self.frameVal = (self.frameVal > endVal) ? endVal : self.frameVal;
        }
        
        // format and print value
        self.d.innerHTML = self.addCommas(self.frameVal.toFixed(decimals));
               
        // whether to continue
        if (progress < self.duration) {
            self.rAF = requestAnimationFrame(self.count);
        } else {
            if (self.callback != null) self.callback();
        }
    }  
    this.start = function(callback) {
        self.callback = callback;
        // make sure values are valid
        if (!isNaN(endVal) && !isNaN(startVal)) {
            requestAnimationFrame(self.count);
        } else {
            console.log('countUp error: startVal or endVal is not a number');
            self.d.innerHTML = '--';
        }
        return false;
    }
    this.stop = function() {
        cancelAnimationFrame(self.rAF);
    }
    this.reset = function() {
        cancelAnimationFrame(self.rAF);
        this.d.innerHTML = startVal;
    }
    this.addCommas = function(nStr) {
        nStr += '';
        var x, x1, x2, rgx;
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
}
// Example:
// var numAnim = new countUp("SomeElementYouWantToAnimate", 0, 99.99, 2, 1.5);
// numAnim.start();
// with optional callback
// numAnim.start(someMethodToCallOnComplete);