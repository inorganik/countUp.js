(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./countUp"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var countUp_1 = require("./countUp");
    console.log('CountUp demo', countUp_1.CountUp);
    var input = function (id) {
        return document.getElementById(id);
    };
    var code, stars, useOnComplete, endVal, options;
    var demo = new countUp_1.CountUp('myTargetElement', 100);
    var codeVisualizer = document.getElementById('codeVisualizer');
    var easingFnsDropdown = input('easingFnsDropdown');
    var errorSection = document.getElementById('errorSection');
    document.getElementById('version').innerHTML = demo.version;
    // HANDLERS
    input('startVal').onchange = updateCodeVisualizer;
    input('endVal').onchange = updateCodeVisualizer;
    input('decimals').onchange = updateCodeVisualizer;
    input('duration').onchange = updateCodeVisualizer;
    input('separator').onchange = updateCodeVisualizer;
    input('decimal').onchange = updateCodeVisualizer;
    input('prefix').onchange = updateCodeVisualizer;
    input('suffix').onchange = updateCodeVisualizer;
    document.getElementById('swapValues').onclick = function () {
        var oldStartVal = input('startVal').value;
        var oldEndVal = input('endVal').value;
        input('startVal').value = oldEndVal;
        input('endVal').value = oldStartVal;
        updateCodeVisualizer();
    };
    input('useEasing').onclick = function (e) {
        console.log(e);
        // useEasing = e.target.value
        // easingFnsDropdown.disabled = !useEasing;
        // if (useEasing) {
        //   easingFnsDropdown.value = 'easeOutExpo';
        //   input('easingFnPreview').value = "";
        // }
        // updateCodeVisualizer();
    };
    input('useGrouping').onclick = function (e) {
        console.log(e);
    };
    var easingFunctions = {
        easeOutExpo: function (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
        },
        outQuintic: function (t, b, c, d) {
            var ts = (t /= d) * t;
            var tc = ts * t;
            return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
        },
        outCubic: function (t, b, c, d) {
            var ts = (t /= d) * t;
            var tc = ts * t;
            return b + c * (tc + -3 * ts + 3 * t);
        }
    };
    function getEasingFn() {
        var fn = input('easingFnsDropdown').value;
        console.log('fn', fn);
        if (fn === 'easeOutExpo') {
            return null;
        }
        if (typeof easingFunctions[fn] === 'undefined') {
            return undefined;
        }
        return easingFunctions[fn];
    }
    function getEasingFnBody(fn) {
        fn = typeof fn === 'undefined' ? getEasingFn() : fn;
        if (typeof fn === 'undefined') {
            return 'undefined function';
        }
        if (fn !== null) {
            return fn.toString().replace(/^ {8}/gm, '');
        }
        return '';
    }
    function getNumerals() {
        var numeralsCode = input('numeralsDropdown').value;
        // optionally provide alternates for 0-9
        switch (numeralsCode) {
            case 'ea': // Eastern Arabic
                return ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            case 'fa': // Farsi
                return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            default:
                return null;
        }
    }
    var stringifyArray = function (arr) { return '[\'' + arr.join('\', \'') + '\']'; };
    function createCountUp() {
        establishOptionsFromInputs();
        // you don't have to create a new instance of CountUp every time you start an animation,
        // you can just change the properties individually. But I do here in case user changes values in demo.
        demo = new countUp_1.CountUp('myTargetElement', endVal, options);
        if (!demo.error) {
            errorSection.style.display = 'none';
            if (useOnComplete) {
                demo.start(methodToCallOnComplete);
            }
            else {
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
        codeVisualizer.innerHTML = 'demo.pauseResume();';
        demo.pauseResume();
    }
    function showCodeAndReset() {
        codeVisualizer.innerHTML = 'demo.reset();';
        demo.reset();
    }
    function showCodeAndUpdate() {
        var updateVal = input('updateVal').value;
        var num = updateVal ? updateVal : 0;
        code = "demo.update(" + num + ");<br>";
        codeVisualizer.innerHTML = code;
        demo.update(num);
    }
    function methodToCallOnComplete() {
        console.log('COMPLETE!');
        alert('COMPLETE!');
    }
    function establishOptionsFromInputs() {
        endVal = Number(input('endVal').value);
        options = {
            startVal: input('startVal').value,
            duration: input('duration').value,
            prefix: input('prefix').value,
            suffix: input('suffix').value,
            decimalPlaces: input('decimals').value,
            useEasing: input('useEasing').value,
            useGrouping: input('useGrouping').value,
            easingFn: typeof getEasingFn() === 'undefined' ? null : getEasingFn(),
            separator: input('separator').value,
            decimal: input('decimal').value,
            numerals: getNumerals()
        };
        console.log('demo options', options);
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                console.log(key, options[key]);
                if (options[key] === null) {
                    delete options[key];
                }
            }
        }
        console.log('fixed opts', options);
    }
    function updateCodeVisualizer() {
        establishOptionsFromInputs();
        code = '';
        if (options.useEasing && options.easingFn) {
            code += 'const easingFn = ';
            var split = getEasingFnBody(options.easingFn).split('\n');
            for (var line in split) {
                if (split.hasOwnProperty(line)) {
                    code += split[line].replace(' ', '&nbsp;') + '<br>';
                }
            }
        }
        function indentedLine(keyPair, singleLine) {
            if (singleLine === void 0) { singleLine = false; }
            var delimeter = (singleLine) ? ';' : ',';
            return "&emsp;&emsp;" + keyPair + delimeter + "<br>";
        }
        code += 'const options = {<br>';
        code += indentedLine("useEasing: " + options.useEasing);
        code += (options.easingFn && options.useEasing) ? indentedLine("easingFn: " + options.easingFn) : '';
        code += indentedLine("useGrouping: " + options.useGrouping);
        code += indentedLine("separator: '" + options.separator + "'");
        code += indentedLine("decimal: '" + options.decimal + "'");
        if (options.prefix.length) {
            code += indentedLine("prefix: '" + options.prefix + "'");
        }
        if (options.suffix.length) {
            code += indentedLine("suffix: '" + options.suffix + "'");
        }
        if (options.numerals && options.numerals.length) {
            code += indentedLine("numerals: '" + stringifyArray(options.numerals) + "'");
        }
        code += '};<br>';
        code += "let demo = new CountUp('myTargetElement', " + endVal + ", options);<br>";
        code += 'if (!demo.error) {<br>';
        if (useOnComplete) {
            code += indentedLine('demo.start(methodToCallOnComplete)', true);
        }
        else {
            code += indentedLine('demo.start()', true);
        }
        code += '} else {<br>';
        code += '&emsp;&emsp;console.error(demo.error);<br>}';
        codeVisualizer.innerHTML = code;
    }
    // get current star count
    var repoInfoUrl = 'https://api.github.com/repos/inorganik/CountUp.js';
    var getStars = new XMLHttpRequest();
    getStars.open('GET', repoInfoUrl, true);
    getStars.timeout = 5000;
    getStars.onreadystatechange = function () {
        // 2: received headers,  3: loading, 4: done
        if (getStars.readyState === 4) {
            if (getStars.status === 200) {
                if (getStars.responseText !== 'undefined') {
                    if (getStars.responseText.length > 0) {
                        var data = JSON.parse(getStars.responseText);
                        stars = data.stargazers_count;
                        // change input values
                        input('startVal').value = 0 + '';
                        input('endVal').value = stars;
                        input('decimals').value = 0 + '';
                        createCountUp();
                    }
                }
            }
        }
    };
    getStars.onerror = function () {
        console.error('error getting stars:', getStars.status);
        stars = getStars.status;
        demo.start();
    };
    getStars.send();
});
