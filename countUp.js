window.requestAnimationFrame =
    window.requestAnimationFrame || 
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || 
    window.msRequestAnimationFrame;

// target = id of Html element where counting occurs
// endVal = the value you want to arrive at
// decimals = number of decimal places in number, default 0
// duration = duration in seconds, default 2

function countUp(target, endVal, decimals, duration) {
    
    var self = this;
    this.d = document.getElementById(target);
    this.dec = decimals * 10 || 0;
    this.duration = duration * 1000 || 2000;

    this.startTime = null;
    this.frameVal = 0;
    
    // Robert Penner's easeOutExpo
    this.easeOutExpo = function(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }
    this.stepUp = function(timestamp) {
        
        if (self.startTime === null) self.startTime = timestamp;
     
        var progress = timestamp - self.startTime;
        
        // easing
        self.frameVal = self.easeOutExpo(progress, 0, endVal, self.duration);
        
        // decimal
        if (self.dec > 0) {
            self.frameVal = Math.round(self.frameVal*self.dec)/self.dec;
            self.frameVal = (self.frameVal > endVal) ? endVal : self.frameVal;
        } 
        
        self.d.innerHTML = self.addCommas(self.frameVal.toFixed(decimals));
                
        if (progress < self.duration) {
            requestAnimationFrame(self.stepUp);
        } else {
            // bc easing prevents endVal being reached
            self.d.innerHTML = self.addCommas(endVal.toFixed(decimals));
        }
    }  
    this.start = function() {
        // make sure endVal is a number
        if (!isNaN(endVal) && endVal !== null) {
            requestAnimationFrame(self.stepUp);
        } else {
            console.log('countUp error: endVal is not a number');
            self.d.innerHTML = '--';
        }
        return false;
    }   
    this.reset = function() {
        this.d.innerHTML = 0;
    }
    this.addCommas = function(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
}
// Example:
// var numAnim = new countUp("SomeElementYouWantToAnimate", 99.99, 2, 1.5);
// numAnim.start();