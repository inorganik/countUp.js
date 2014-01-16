/*

    countUp.js
    by @inorganik
    v 0.0.4

*/

// target = id of Html element where counting occurs
// startVal = the value you want to begin at
// endVal = the value you want to arrive at
// decimals = number of decimal places in number, default 0
// duration = duration in seconds, default 2

function countUp(target, startVal, endVal, decimals, duration) {
    
    var self = this;

    var lastTime = 0; // for rAF polyfil

    // make sure requestAnimationFrame is defined
    window.requestAnimationFrame =
        window.requestAnimationFrame || 
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || 
        window.msRequestAnimationFrame ||
        // polyfill for browsers without native support
        // by Opera engineer Erik Möller
        function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            self.lastTime = currTime + timeToCall;
            return id;
        };

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
            requestAnimationFrame(self.count);
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
    this.reset = function() {
        this.d.innerHTML = 0;
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