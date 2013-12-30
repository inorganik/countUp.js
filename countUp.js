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
        self.frameVal = easeOutExpo(progress, 0, endVal, self.duration);
        
        // decimal
        if (self.dec > 0) {
            self.frameVal = Math.round(self.frameVal*self.dec)/self.dec;
            self.frameVal = (self.frameVal > endVal) ? endVal : self.frameVal;
        } 
        
        self.d.innerHTML = self.frameVal.toFixed(decimals);
                
        if (progress < self.duration) {
            requestAnimationFrame(self.stepUp);
        } else {
            // bc easing prevents endVal being reached
            self.d.innerHTML = endVal.toFixed(decimals);
        }
    }  
    this.start = function() {
        requestAnimationFrame(self.stepUp);
    }    
    this.reset = function() {
        this.d.innerHTML = 0;
    }
}
// Example:
// var numAnim = new countUp("SomeElementYouWantToAnimate", 99.99, 2, 1.5);
// numAnim.start();