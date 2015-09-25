(function (angular) {

	// Count-Up directive
	// --------------------------------------------
	//
	// * **Class:** CountUp
	// * **Author:** Jamie Perkins
	//
	// Creates a counting animation for numbers
	// REQUIRED attributes: 
	// - id
	// - endVal

	'use strict';

	var module = angular.module('countUpModule', []);

	module.directive('countUp', ['$filter',
		function ($filter) {

		return {
			restrict: 'A',
			link: function ($scope, $el, $attrs) {
		        
		        /* 	a lightweight version of countUp.js
		        	- pauseResume() removed
		        	- $filter used instead of formatNumber()
		        */
				function CountUp(target, startVal, endVal, decimals, duration) {

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
			            }
			        }
			        if (!window.cancelAnimationFrame) {
			            window.cancelAnimationFrame = function(id) {
			                clearTimeout(id);
			            }
			        }

			        this.d = document.getElementById(target);
			        this.startVal = startVal;
			        this.endVal = endVal;
			        this.countDown = (this.startVal > this.endVal);
			        this.frameVal = this.startVal;
			        this.duration = duration * 1000 || 2000;
				    this.decimals = Math.max(0, decimals || 0);
				    this.dec = Math.pow(10, this.decimals);
			        var self = this;
			        
			        // Print value to target
			        this.printValue = function(value) {
			        	console.log(value);
			            var result = $filter('number')(value, decimals);
			            console.log(result);
			            this.d.innerHTML = result;
			        }
			        // Robert Penner's easeOutExpo
			        this.easeOutExpo = function(t, b, c, d) {
			            return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
			        }
			        this.count = function(timestamp) {

			            if (!self.startTime) self.startTime = timestamp;

			            self.timestamp = timestamp;

			            var progress = timestamp - self.startTime;
			            self.remaining = self.duration - progress;

			            // always ease
		                if (self.countDown) {
		                    self.frameVal = self.startVal - self.easeOutExpo(progress, 0, self.startVal - self.endVal, self.duration);
		                } else {
		                    self.frameVal = self.easeOutExpo(progress, self.startVal, self.endVal - self.startVal, self.duration);
		                }

			            // don't go past endVal since progress can exceed duration in the last frame
			            if (self.countDown) {
			                self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
			            } else {
			                self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
			            }

			            // format and print value
			            self.frameVal = Math.round(self.frameVal*self.dec)/self.dec
			            self.printValue(self.frameVal);
			                   
			            // whether to continue
			            if (progress < self.duration) {
			                self.rAF = requestAnimationFrame(self.count);
			            } else {
			                if (self.callback) self.callback();
			            }
			        }
			        // start your animation
			        this.start = function(callback) {
			            self.callback = callback;
			            // make sure values are valid
			            if (!isNaN(self.endVal) && !isNaN(self.startVal) && self.startVal !== self.endVal) {
			                self.rAF = requestAnimationFrame(self.count);
			            } else {
			                this.d.innerHTML = endVal;
			            }
			            return false;
			        }
			        // reset to startVal so animation can be run again
			        this.reset = function() {
			            self.paused = false;
			            delete self.startTime;
			            self.startVal = startVal;
			            cancelAnimationFrame(self.rAF);
			            self.printValue(self.startVal);
			        }
				    // pass a new endVal and start animation
				    this.update = function (newEndVal) {
				    	delete self.callback; // avoid endless callback loop
				        cancelAnimationFrame(self.rAF);
				        self.paused = false;
				        delete self.startTime;
				        self.startVal = self.frameVal;
				        self.endVal = Number(newEndVal);
				        self.countDown = (self.startVal > self.endVal);
				        self.rAF = requestAnimationFrame(self.count);
				    };

			        // format startVal on initialization
			        self.printValue(self.startVal);
			    }

				var sta = $attrs.startVal || 0;
				if (isNaN(sta)) sta = Number(sta.match(/[\d\-\.]+/g).join('')); // strip non-numerical characters
				var end = $attrs.endVal || 0;
				if (isNaN(end)) end = Number(end.match(/[\d\-\.]+/g).join('')); // strip non-numerical characters
				var dur = Number($attrs.duration) || 2.5,
					dec = Number($attrs.decimals) || 0;

				// construct countUp 
				var countUp = new CountUp($attrs.id, sta, end, dec, dur);
				if (end > 9999) {
					// make easing smoother for large numbers
					countUp = new CountUp($attrs.id, sta, end - 100, dec, dur / 2);
				}
				
				function animate() {

					if (end > 9999) {
						countUp.reset();
						countUp.start(function() {
							countUp.update(end);
						});
					}
					else {
						countUp.reset();
						countUp.start();
					}
				}

				// fire on scroll-spy event, or right away
				if ($attrs.scrollSpyEvent) {
					// listen for scroll spy event
					$scope.$on($attrs.scrollSpyEvent, function (event, data) {
						if (data === $attrs.id) {
							animate();
						}
					});
				}
				else {
					animate();
				}

				// re-animate on click
				$el.on('click', function() { 
					animate();
				});
			}
		}
	}]);
})(angular);	