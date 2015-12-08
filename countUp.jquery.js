/*

    countUp.jquery.js Jquery plugin
    (c) 2015 @pantrif Leonidas Maroulis
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
	var instance = [];
	
    $.fn.CountUp = function(method,startVal, endVal, decimals, duration, opts, callback) {
    	 var args = [].slice.call(arguments);

		 return this.each(function(index) {

			if(instance[index]=="undefined" || !instance[index]){
				var end = $(this).data('endval')==undefined?endVal:$(this).data('endval');
				
				instance[index] = new CountUp(this, startVal, end, decimals, duration, options);
				instance[index].d = $(this);
				instance[index].printValue = function(val) { 
					var self = instance[index];
					var result = (!isNaN(val)) ? self.formatNumber(val) : '--';
					if(typeof self.d.prop("tagName")!="undefined"){
						
						tagName = self.d.prop("tagName").toUpperCase();
						if (tagName == 'INPUT') {
							this.d.val(result);
						}
						else {
							this.d.html(result);
						}
					}
				};
			}
			switch (method){
				case "start":
					if(typeof callback=='function'){
						instance[index].start(callback);
					}else{
						instance[index].start();
					}
					break;
				case "update":
					//check whether data-endVal is different otherwise take second argument
					var num = $(this).data('endval')==undefined || $(this).data('endval')==instance[index].endVal?args[1]:$(this).data('endval');
					if(num!=undefined){
						instance[index].update(num)
					}
					break;
				case "pauseResume":
					instance[index].pauseResume();
					break;
				case "reset":
					instance[index].reset();
					break;
			}

			
		});
    };

})(window, jQuery); 
	
	
// Example:
// var numAnim = new countUp("SomeElementYouWantToAnimate", 0, 99.99, 2, 2.5);
// numAnim.start();
// numAnim.update(135);
// with optional callback:
// numAnim.start(someMethodToCallOnComplete);
