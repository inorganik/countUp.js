// same as demo.js but with a different instantiation of CountUp,
// and no lambdas

window.onload = function () {
  var el = function (id) {
    return document.getElementById(id);
  };
  var code, stars, endVal, options;
  var demo = new countUp.CountUp('myTargetElement', 100);
  var codeVisualizer = el('codeVisualizer');
  var errorSection = el('errorSection');
  el('version').innerHTML = demo.version;

  var changeEls = document.querySelectorAll('.updateCodeVis');
  for (var i = 0, len = changeEls.length; i < len; i++) {
    changeEls[i].onchange = updateCodeVisualizer;
  }

  el('swapValues').onclick = function () {
    var oldStartVal = el('startVal').value;
    var oldEndVal = el('endVal').value;
    el('startVal').value = oldEndVal;
    el('endVal').value = oldStartVal;
    updateCodeVisualizer();
  };
  el('start').onclick = createCountUp;
  el('apply').onclick = createCountUp;
  el('pauseResume').onclick = function () {
    code += '<br>demo.pauseResume();';
    codeVisualizer.innerHTML = code;
    demo.pauseResume();
  };
  el('reset').onclick = function () {
    code += '<br>demo.reset();';
    codeVisualizer.innerHTML = code;
    demo.reset();
  };
  el('update').onclick = function () {
    var updateVal = el('updateVal').value;
    var num = updateVal ? updateVal : 0;
    code += "<br>demo.update(" + num + ");";
    codeVisualizer.innerHTML = code;
    demo.update(num);
  };
  el('updateVal').onchange = function () {
    var updateVal = el('updateVal').value;
    var num = updateVal ? updateVal : 0;
    code += '<br>demo.update(' + num + ');';
    codeVisualizer.innerHTML = code;
  };
  // OPTION VALUES
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
    var fn = el('easingFnsDropdown').value;
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
    var numeralsCode = el('numeralsDropdown').value;
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
  // COUNTUP AND CODE VISUALIZER
  function createCountUp() {
    establishOptionsFromInputs();
    demo = new countUp.CountUp('myTargetElement', endVal, options);
    if (!demo.error) {
      errorSection.style.display = 'none';
      if (el('useOnComplete').checked) {
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
  function methodToCallOnComplete() {
    console.log('COMPLETE!');
    alert('COMPLETE!');
  }
  function establishOptionsFromInputs() {
    endVal = Number(el('endVal').value);
    options = {
      startVal: el('startVal').value,
      decimalPlaces: el('decimalPlaces').value,
      duration: Number(el('duration').value),
      useEasing: el('useEasing').checked,
      useGrouping: el('useGrouping').checked,
      easingFn: typeof getEasingFn() === 'undefined' ? null : getEasingFn(),
      separator: el('separator').value,
      decimal: el('decimal').value,
      prefix: el('prefix').value,
      suffix: el('suffix').value,
      numerals: getNumerals()
    };
    // unset null values so they don't overwrite defaults
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        if (options[key] === null) {
          delete options[key];
        }
      }
    }
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
    var opts = '';
    opts += (options.startVal !== '0') ? indentedLine("startVal: " + options.startVal) : '';
    opts += (options.decimalPlaces !== '0') ? indentedLine("decimalPlaces: " + options.decimalPlaces) : '';
    opts += (options.duration !== 2) ? indentedLine("duration: " + options.duration) : '';
    opts += (options.useEasing) ? '' : indentedLine("useEasing: " + options.useEasing);
    opts += (options.useEasing && options.easingFn) ? indentedLine("easingFn") : '';
    opts += (options.useGrouping) ? '' : indentedLine("useGrouping: " + options.useGrouping);
    opts += (options.separator !== ',') ? indentedLine("separator: '" + options.separator + "'") : '';
    opts += (options.decimal !== '.') ? indentedLine("decimal: '" + options.decimal + "'") : '';
    opts += (options.prefix.length) ? indentedLine("prefix: '" + options.prefix + "'") : '';
    opts += (options.suffix.length) ? indentedLine("suffix: '" + options.suffix + "'") : '';
    opts += (options.numerals && options.numerals.length) ?
      indentedLine("numerals: " + stringifyArray(options.numerals)) : '';
    if (opts.length) {
      code += "const options = {<br>" + opts + "};<br>";
      code += "let demo = new CountUp('myTargetElement', " + endVal + ", options);<br>";
    }
    else {
      code += "let demo = new CountUp('myTargetElement', " + endVal + ");<br>";
    }
    code += 'if (!demo.error) {<br>';
    code += (el('useOnComplete').checked) ?
      indentedLine('demo.start(methodToCallOnComplete)', true) : indentedLine('demo.start()', true);
    code += '} else {<br>';
    code += indentedLine('console.error(demo.error)', true);
    code += '}';
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
            el('endVal').value = stars;
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
}
