(function($) {
 
    $.fn.countup = function(params) {
 		// make sure dependency is present
        if (typeof CountUp !== 'function') {
        	console.error('countUp.js is a required dependency of countUp-jquery.js.');
        	return;
        }

        var defaults = {
        	startVal: 0,
        	decimals: 0,
        	duration: 2,
        };

        if (typeof params === 'number') {
        	defaults.endVal = params;
        }
        else if (typeof params === 'object') {
        	$.extend(defaults, params);
        }
        else {
        	console.error('countUp-jquery requires its argument to be either an object or number');
        	return;
        } 

        this.each(function(i, elem) {
        	var countUp = new CountUp(elem, defaults.startVal, defaults.endVal, defaults.decimals, defaults.duration, defaults.options);

        	countUp.start();
        });



        return this;
 
    };
 
}(jQuery));