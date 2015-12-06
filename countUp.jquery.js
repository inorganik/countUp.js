/*

    countUp.jquery.js Jquery plugin
    (c) 2015 Jquery version by @pantrif (Leonidas Maroulis)
	based on @inorganik countUp.js
    Licensed under the MIT license.

*/

// target = id of html element or var of previously selected html element where counting occurs
// startVal = the value you want to begin at
// endVal = the value you want to arrive at
// decimals = number of decimal places, default 0
// duration = duration of animation in seconds, default 2
// options = optional object of options (see below)

(function( window, $ ) {


	var self;
    // make sure requestAnimationFrame and cancelAnimationFrame are defined
    // polyfill for browsers without native support
    // by Opera engineer Erik Möller
    var lastTime = 0;
    var vendors = ['webkit', 'moz', 'ms', 'o'];
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
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
	
	var CountUp = function(elem, startVal, endVal, decimals, duration, opts){
		this.elem = elem;
		this.$elem = $(elem);
		this.options = opts;
		this.d = this.$elem;
		this.startVal = Number(startVal);
		this.endVal = Number(endVal);
		this.countDown = (this.startVal > this.endVal);
		this.frameVal = this.startVal;
		this.decimals = Math.max(0, decimals || 0);
		this.dec = Math.pow(10, this.decimals);
		this.duration = Number(duration) * 1000 || 2000;
	};
  
	CountUp.prototype = {
			defaults: {
				useEasing : true, // toggle easing
				useGrouping : true, // 1,000,000 vs 1000000
				separator : ',', // character to use as a separator
				decimal : '.', // character to use as a decimal
				prefix : '',
				suffix : ''
			},
			version : function () { 
				return '1.6.0'; 
			},
			printValue : function(value) {
				var result = (!isNaN(value)) ? self.formatNumber(value) : '--';
				
				if(typeof self.d.prop("tagName")!="undefined"){
					
					tagName = self.d.prop("tagName").toUpperCase();
					if (tagName == 'INPUT') {
						this.d.val(result);
					}
					else {
						this.d.html(result);
					}
				}
			},
			// Robert Penner's easeOutExpo
			easeOutExpo : function(t, b, c, d) {
				return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
			},
			count : function(timestamp) {

				if (!self.startTime) self.startTime = timestamp;

				self.timestamp = timestamp;

				var progress = timestamp - self.startTime;
				self.remaining = self.duration - progress;

				// to ease or not to ease
				if (self.options.useEasing) {
					if (self.countDown) {
						self.frameVal = self.startVal - self.easeOutExpo(progress, 0, self.startVal - self.endVal, self.duration);
					} else {
						self.frameVal = self.easeOutExpo(progress, self.startVal, self.endVal - self.startVal, self.duration);
					}
				} else {
					if (self.countDown) {
						self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration));
					} else {
						self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
					}
				}

				// don't go past endVal since progress can exceed duration in the last frame
				if (self.countDown) {
					self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
				} else {
					self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
				}

				// decimal
				self.frameVal = Math.round(self.frameVal*self.dec)/self.dec;

				// format and print value
				self.printValue(self.frameVal);

				// whether to continue
				if (progress < self.duration) {
					self.rAF = requestAnimationFrame(self.count);
				} else {
					if (self.callback) self.callback();
				}
			},
			// toggles pause/resume animation
			pauseResume : function() {
				if (!self.paused) {
					self.paused = true;
					cancelAnimationFrame(self.rAF);
				} else {
					self.paused = false;
					delete self.startTime;
					self.duration = self.remaining;
					self.startVal = self.frameVal;
					requestAnimationFrame(self.count);
				}
			},
			// reset to startVal so animation can be run again
			reset : function() {
				self.paused = false;
				delete self.startTime;
				//self.startVal = startVal;
				cancelAnimationFrame(self.rAF);
				self.printValue(self.startVal);
			},
			// pass a new endVal and start animation
			update : function (newEndVal) {
				cancelAnimationFrame(self.rAF);
				self.paused = false;
				delete self.startTime;
				self.startVal = self.frameVal;
				self.endVal = Number(newEndVal);
				self.countDown = (self.startVal > self.endVal);
				self.rAF = requestAnimationFrame(self.count);
			},
			formatNumber : function(nStr) {
				nStr = nStr.toFixed(self.decimals);
				nStr += '';
				var x, x1, x2, rgx;
				x = nStr.split('.');
				x1 = x[0];
				x2 = x.length > 1 ? self.options.decimal + x[1] : '';
				rgx = /(\d+)(\d{3})/;
				if (self.options.useGrouping) {
					while (rgx.test(x1)) {
						x1 = x1.replace(rgx, '$1' + self.options.separator + '$2');
					}
				}
				return self.options.prefix + x1 + x2 + self.options.suffix;
			},
			start: function(callback){
				this.options = $.extend({}, this.defaults, this.options, this.metadata);
				self =this;
				
				if (this.options.separator === '') this.options.useGrouping = false;
				if (!this.options.prefix) this.options.prefix = '';
				if (!this.options.suffix) this.options.suffix = '';
				
			
				self.callback = callback;
				self.rAF = requestAnimationFrame(self.count);
				
				self.printValue(self.startVal);
				
				return self;
			}
	  
	  };

	CountUp.defaults = CountUp.prototype.defaults;

	$.fn.CountUp = function(startVal, endVal, decimals, duration, opts,callback) {		
			return new CountUp(this, startVal, endVal, decimals, duration, opts);
	  };

	
  window.CountUp = CountUp;
})(window, jQuery);	
	
	
// Example:
// var numAnim = $(".countup").CountUp( 0, 99.99, 2, 2.5);
// numAnim.start();
// numAnim.update(135);
// with optional callback:
// numAnim.start(someMethodToCallOnComplete);
