import { CountUp } from './countUp';

const input = (id: string): HTMLInputElement => {
  return document.getElementById(id) as HTMLInputElement;
};
let code, stars, endVal, options;
let demo = new CountUp('myTargetElement', 100);
const codeVisualizer = document.getElementById('codeVisualizer');
const errorSection = document.getElementById('errorSection');
document.getElementById('version').innerHTML = demo.version;

// HANDLERS

input('startVal').onchange = updateCodeVisualizer;
input('endVal').onchange = updateCodeVisualizer;
input('decimalPlaces').onchange = updateCodeVisualizer;
input('duration').onchange = updateCodeVisualizer;
input('separator').onchange = updateCodeVisualizer;
input('decimal').onchange = updateCodeVisualizer;
input('prefix').onchange = updateCodeVisualizer;
input('suffix').onchange = updateCodeVisualizer;
input('useEasing').onclick = updateCodeVisualizer;
input('useGrouping').onclick = updateCodeVisualizer;
input('useOnComplete').onclick = updateCodeVisualizer;
input('easingFnsDropdown').onchange = updateCodeVisualizer;
input('numeralsDropdown').onchange = updateCodeVisualizer;
document.getElementById('swapValues').onclick = () => {
  const oldStartVal = input('startVal').value;
  const oldEndVal = input('endVal').value;
  input('startVal').value = oldEndVal;
  input('endVal').value = oldStartVal;
  updateCodeVisualizer();
};
document.getElementById('start').onclick = createCountUp;
document.getElementById('apply').onclick = createCountUp;
document.getElementById('pauseResume').onclick = () => {
  code += '<br>demo.pauseResume();';
  codeVisualizer.innerHTML = code;
  demo.pauseResume();
};
document.getElementById('reset').onclick = () => {
  code += '<br>demo.reset();';
  codeVisualizer.innerHTML = code;
  demo.reset();
};
document.getElementById('update').onclick = () => {
  const updateVal = input('updateVal').value;
  const num = updateVal ? updateVal : 0;
  code += `<br>demo.update(${num});`;
  codeVisualizer.innerHTML = code;
  demo.update(num);
};
input('updateVal').onchange = () => {
  const updateVal = input('updateVal').value;
  const num = updateVal ? updateVal : 0;
  code += '<br>demo.update(' + num + ');';
  codeVisualizer.innerHTML = code;
};

// OPTION VALUES

const easingFunctions = {
  easeOutExpo: (t, b, c, d) =>
    c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b,
  outQuintic: (t, b, c, d) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
  },
  outCubic: (t, b, c, d) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }
};
function getEasingFn() {
  const fn = input('easingFnsDropdown').value;
  if (fn === 'easeOutExpo') { return null; }
  if (typeof easingFunctions[fn] === 'undefined') { return undefined; }

  return easingFunctions[fn];
}
function getEasingFnBody (fn: any) {
  fn = typeof fn === 'undefined' ? getEasingFn() : fn;
  if (typeof fn === 'undefined') { return 'undefined function'; }
  if (fn !== null) {
    return fn.toString().replace(/^ {8}/gm, '');
  }
  return '';
}
function getNumerals() {
  const numeralsCode = input('numeralsDropdown').value;
  // optionally provide alternates for 0-9
  switch (numeralsCode) {
    case 'ea': // Eastern Arabic
      return ['٠' ,'١' ,'٢' ,'٣' ,'٤' ,'٥' ,'٦' ,'٧' ,'٨' ,'٩'];
    case 'fa': // Farsi
      return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    default:
      return null;
  }
}
const stringifyArray = (arr) => '[\'' + arr.join('\', \'') + '\']';

// COUNTUP AND CODE VISUALIZER

function createCountUp() {

  establishOptionsFromInputs();

  demo = new CountUp('myTargetElement', endVal, options);

  if (!demo.error) {
    errorSection.style.display = 'none';
    if (input('useOnComplete').checked) {
      demo.start(methodToCallOnComplete);
    } else {
      demo.start();
    }
    updateCodeVisualizer();
  } else {
    errorSection.style.display = 'block';
    document.getElementById('error').innerHTML = demo.error;
    console.error(demo.error);
  }
}

function methodToCallOnComplete () {
  console.log('COMPLETE!');
  alert('COMPLETE!');
}

function establishOptionsFromInputs() {
  endVal = Number(input('endVal').value);

  options = {
    startVal: input('startVal').value,
    decimalPlaces: input('decimalPlaces').value,
    duration: Number(input('duration').value),
    useEasing: input('useEasing').checked,
    useGrouping: input('useGrouping').checked,
    easingFn: typeof getEasingFn() === 'undefined' ? null : getEasingFn(),
    separator: input('separator').value,
    decimal: input('decimal').value,
    prefix: input('prefix').value,
    suffix: input('suffix').value,
    numerals: getNumerals()
  };

  // unset null values so they don't overwrite defaults
  for (const key in options) {
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
    const split = getEasingFnBody(options.easingFn).split('\n');
    for (const line in split) {
      if (split.hasOwnProperty(line)) {
        code += split[line].replace(' ', '&nbsp;') + '<br>';
      }
    }
  }

  function indentedLine(keyPair: string, singleLine: boolean =  false): string {
    const delimeter = (singleLine) ? ';' : ',';
    return `&emsp;&emsp;${keyPair}${delimeter}<br>`;
  }
  let opts = '';
  opts += (options.startVal !== '0') ? indentedLine(`startVal: ${options.startVal}`) : '';
  opts += (options.decimalPlaces !== '0') ? indentedLine(`decimalPlaces: ${options.decimalPlaces}`) : '';
  opts += (options.duration !== 2) ? indentedLine(`duration: ${options.duration}`) : '';
  opts += (options.useEasing) ? '' : indentedLine(`useEasing: ${options.useEasing}`);
  opts += (options.useEasing && options.easingFn) ? indentedLine(`easingFn`) : '';
  opts += (options.useGrouping) ? '' : indentedLine(`useGrouping: ${options.useGrouping}`);
  opts += (options.separator !== ',') ? indentedLine(`separator: '${options.separator}'`) : '';
  opts += (options.decimal !== '.') ? indentedLine(`decimal: '${options.decimal}'`) : '';
  opts += (options.prefix.length) ? indentedLine(`prefix: '${options.prefix}'`) : '';
  opts += (options.suffix.length) ? indentedLine(`suffix: '${options.suffix}'`) : '';
  opts += (options.numerals && options.numerals.length) ?
    indentedLine(`numerals: '${stringifyArray(options.numerals)}'`) : '';
  if (opts.length) {
    code += `const options = {<br>${opts}};<br>`;
    code += `let demo = new CountUp('myTargetElement', ${endVal}, options);<br>`;
  } else {
    code += `let demo = new CountUp('myTargetElement', ${endVal});<br>`;
  }
  code += 'if (!demo.error) {<br>';
  code += (input('useOnComplete').checked) ?
    indentedLine('demo.start(methodToCallOnComplete)', true) : indentedLine('demo.start()', true);
  code += '} else {<br>';
  code += indentedLine('console.error(demo.error)', true);
  code += '}';
  codeVisualizer.innerHTML = code;
}

// get current star count

const repoInfoUrl = 'https://api.github.com/repos/inorganik/CountUp.js';
const getStars = new XMLHttpRequest();
getStars.open('GET', repoInfoUrl, true);
getStars.timeout = 5000;

getStars.onreadystatechange = () => {
  // 2: received headers,  3: loading, 4: done
  if (getStars.readyState === 4) {
    if (getStars.status === 200) {
      if (getStars.responseText !== 'undefined') {
        if (getStars.responseText.length > 0) {
          const data = JSON.parse(getStars.responseText);
          stars = data.stargazers_count;
          // change input values
          input('endVal').value = stars;
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
