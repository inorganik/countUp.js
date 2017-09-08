/*
	demo.js

	Only used for the countUp demo page, not a dependency
*/

var demo, options, code, data, stars, easingFunctions,
	useOnComplete = false,
	useEasing = true,
	easingFn = null,
	useGrouping = true;

window.onload = function() {

	var codeVisualizer = codeVisualizer,
		easingFnsDropdown = document.getElementById('easingFnsDropdown'),
		errorSection = document.getElementById('errorSection');

	// setup CountUp object - last 3 params (decimals, duration, options) are optional
	demo = new CountUp('myTargetElement', 0, 100, 0, 2.5, options);
	// you could do demo.start() right here but we are getting actual current star count from github api below
	// since it is an asynchronous call, we fire start() in the success fn of the XMLHttpRequest object
	getStars.send();
	// display version
	document.getElementById('version').innerHTML = 'v'+demo.version();
};

easingFunctions = {
	easeOutExpo: function(t, b, c, d) {
		return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
	},
	outQuintic: function(t, b, c, d) {
		var ts = (t /= d) * t;
		var tc = ts * t;
		return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
	},
	outCubic: function(t, b, c, d) {
		var ts = (t /= d) * t;
		var tc = ts * t;
		return b + c * (tc + -3 * ts + 3 * t);
	}
};

// for demo:
function swapValues() {
	var oldStartVal = document.getElementById('startVal').value;
	var oldEndVal = document.getElementById('endVal').value;
	document.getElementById('startVal').value = oldEndVal;
	document.getElementById('endVal').value = oldStartVal;
	updateCodeVisualizer();
}
function getEasingFn() {
	var fn = easingFnsDropdown.value;
	if (fn === 'easeOutExpo') return null;
	if (typeof easingFunctions[fn] === 'undefined') return undefined;

	return easingFunctions[fn];
}
function getEasingFnBody(fn) {
	fn = typeof fn === 'undefined' ? getEasingFn() : fn;

	if (typeof fn === 'undefined') return 'undefined function';

	if (fn !== null) {
		return fn.toString().replace(/^ {8}/gm, '');
	}

	return '';
}
function getNumerals() {
	var numeralsCode = document.getElementById('numeralsDropdown').value;
	// optionally provide alternates for 0-9
	switch (numeralsCode) {
		case 'ea': // Eastern Arabic
			return ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
		case 'fa': // Farsi
			return ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
		default:
			return []
	}
}
function stringifyArray(arr) {
	return '[\'' + arr.join('\', \'') + '\']';

}
function createCountUp() {

	var startVal = document.getElementById('startVal').value;
	var endVal = document.getElementById('endVal').value;
	var decimals = document.getElementById('decimals').value,
		duration = document.getElementById('duration').value,
		prefix = document.getElementById('prefix').value,
		suffix = document.getElementById('suffix').value,
		easingFn = getEasingFn();

	options = {
		useEasing: useEasing,
		easingFn: typeof easingFn === 'undefined' ? null : easingFn,
		useGrouping: useGrouping,
		separator: document.getElementById('separator').value,
		decimal: document.getElementById('decimal').value,
		numerals: getNumerals()
	};
	if (prefix.length) options.prefix = prefix;
	if (suffix.length) options.suffix = suffix;

	// you don't have to create a new instance of CountUp every time you start an animation,
	// you can just change the properties individually. But I do here in case user changes values in demo.
	demo = new CountUp('myTargetElement', startVal, endVal, decimals, duration, options);
	if (!demo.error) {
		errorSection.style.display = 'none';
		if (useOnComplete) {
			demo.start(methodToCallOnComplete);
		} else {
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
function showCodeAndPauseResume() {
	code = 'demo.pauseResume();';
	codeVisualizer.innerHTML = code;
	demo.pauseResume();
}
function showCodeAndReset() {
	code = 'demo.reset();';
	codeVisualizer.innerHTML = code;
	demo.reset();
}
function showCodeAndUpdate() {
	var updateVal = document.getElementById('updateVal').value;
	var num = updateVal ? updateVal : 0;
	code = 'demo.update('+num+');<br>';
	code += '// update method is useful for counting to large numbers. See README.';
	codeVisualizer.innerHTML = code;
	demo.update(num);
}
function toggleOnComplete(checkbox) {
	useOnComplete = checkbox.checked;
	updateCodeVisualizer();
}
function toggleEasing(checkbox) {
	useEasing = checkbox.checked
	easingFnsDropdown.disabled = !useEasing
	if (useEasing) {
		easingFnsDropdown.value = 'easeOutExpo';
		document.getElementById('easingFnPreview').value = "";
	} 
	updateCodeVisualizer();
}
function toggleGrouping(checkbox) {
	useGrouping = checkbox.checked;
	updateCodeVisualizer();
}
function methodToCallOnComplete() {
	console.log('COMPLETE!');
	alert('COMPLETE!');
}
function updateCodeVisualizer() {
	var startVal = document.getElementById('startVal').value;
	startVal = Number(startVal.replace(',','').replace(' ',''));
	var endVal = document.getElementById('endVal').value;
	endVal = Number(endVal.replace(',','').replace(' ',''));
	var decimals = document.getElementById('decimals').value,
		duration = document.getElementById('duration').value,
		separator = document.getElementById('separator').value,
		decimal = document.getElementById('decimal').value,
		prefix = document.getElementById('prefix').value,
		suffix = document.getElementById('suffix').value,
		easingFn = getEasingFn(),
		easingFnBody = getEasingFnBody(easingFn),
		numerals = getNumerals(),
		code = '';

	if (useEasing && easingFn) {
		code += 'var easingFn = ';
		var split = easingFnBody.split('\n');

		for (var line in split) {
			code += split[line].replace(' ', '&nbsp;') + '<br>';
		}
	}

	code += 'var options = {<br>';
	code += (useEasing) ? '&emsp;&emsp;useEasing: true, <br>' : '&emsp;&emsp;useEasing: false, <br>';
	code += (easingFn && useEasing) ? '&emsp;&emsp;easingFn: easingFn, <br>' : '';
	code += (useGrouping) ? '&emsp;&emsp;useGrouping: true, <br>' : '&emsp;&emsp;useGrouping: false, <br>';
	code += '&emsp;&emsp;separator: \''+separator+'\', <br>';
	code += '&emsp;&emsp;decimal: \''+decimal+'\', <br>';
	if (prefix.length) code += '&emsp;&emsp;prefix: \''+prefix+'\', <br>';
	if (suffix.length) code += '&emsp;&emsp;suffix: \''+suffix+'\' <br>';
	if (numerals.length) code += '&emsp;&emsp;numerals: '+stringifyArray(numerals)+' <br>';
	code += '};<br>';
	code += 'var demo = new CountUp(\'myTargetElement\', '+startVal+', '+endVal+', '+decimals+', '+duration+', options);<br>';
	code += 'if (!demo.error) {<br>';
	if (useOnComplete) {
		code += '&emsp;&emsp;demo.start(methodToCallOnComplete);<br>';
	} else {
		code += '&emsp;&emsp;demo.start();<br>';
	}
	code += '} else {<br>';
	code += '&emsp;&emsp;console.error(demo.error);<br>}';
	codeVisualizer.innerHTML = code;
}
function updateCodeVisualizerForUpdate() {
	var updateVal = document.getElementById('updateVal').value;
	var num = updateVal ? updateVal : 0;
	code = 'demo.update(' + updateVal + ');';
	codeVisualizer.innerHTML = code;
}

// get current star count
var repoInfoUrl = 'https://api.github.com/repos/inorganik/CountUp.js';
var getStars = new XMLHttpRequest();
getStars.open('GET', repoInfoUrl, true);
getStars.timeout = 5000;

getStars.onreadystatechange = function() {
	// 2: received headers,  3: loading, 4: done
	if (getStars.readyState == 4) {
		if (getStars.status == 200) {
			if (getStars.responseText !== 'undefined') {
				if (getStars.responseText.length > 0) {
					data = JSON.parse(getStars.responseText);
					stars = data.stargazers_count;
					// change input values
					document.getElementById('startVal').value = 0;
					document.getElementById('endVal').value = stars;
					document.getElementById('decimals').value = 0;
					
					createCountUp();
				}
			}
		}
	}
};
getStars.onerror = function() {
	console.error('error getting stars:', getStars.status);
	stars = getStars.status;
	demo.start();
};