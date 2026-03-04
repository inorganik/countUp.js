import { CountUp } from '../dist/countUp.js';

const el = (id) => document.getElementById(id);

let code, stars, endVal, options;
let demo = new CountUp('myTargetElement', 100);
let scrollSpyCountUp, hiddenAtInitCountUp, insideModalCountUp;
const codeVisualizer = el('codeVisualizer');
const errorSection = el('errorSection');
let startTime;
el('version').textContent = demo.version;

document.querySelectorAll('.updateCodeVis').forEach((elem) => {
  elem.addEventListener('change', updateCodeVisualizer);
});

el('swapValues').addEventListener('click', () => {
  const oldStartVal = el('startVal').value;
  const oldEndVal = el('endVal').value;
  el('startVal').value = oldEndVal;
  el('endVal').value = oldStartVal;
  updateCodeVisualizer();
});
el('start').addEventListener('click', createCountUp);
el('apply').addEventListener('click', createCountUp);
el('pauseResume').addEventListener('click', () => {
  code += '<br>demo.pauseResume();';
  codeVisualizer.innerHTML = code;
  demo.pauseResume();
});
el('reset').addEventListener('click', () => {
  code += '<br>demo.reset();';
  codeVisualizer.innerHTML = code;
  demo.reset();
});
el('update').addEventListener('click', () => {
  const num = el('updateVal').value || 0;
  code += `<br>demo.update(${num});`;
  codeVisualizer.innerHTML = code;
  demo.update(num);
});
el('updateVal').addEventListener('change', () => {
  const num = el('updateVal').value || 0;
  code += `<br>demo.update(${num});`;
  codeVisualizer.innerHTML = code;
});

const easingFunctions = {
  easeOutExpo: (t, b, c, d) => c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b,
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
  const fn = el('easingFnsDropdown').value;
  if (fn === 'easeOutExpo') return null;
  if (easingFunctions[fn] === undefined) return undefined;
  return easingFunctions[fn];
}

function getEasingFnBody(fn = getEasingFn()) {
  if (fn === undefined) return 'undefined function';
  if (fn !== null) return fn.toString().replace(/^ {4}/gm, '');
  return '';
}

function getNumerals() {
  const numeralsCode = el('numeralsDropdown').value;
  switch (numeralsCode) {
    case 'ea':
      return ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    case 'fa':
      return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    default:
      return null;
  }
}

const stringifyArray = (arr) => `['${arr.join("', '")}']`;

function createCountUp() {
  demo.onDestroy();
  establishOptionsFromInputs();
  demo = new CountUp('myTargetElement', endVal, options);
  if (!demo.error) {
    errorSection.style.display = 'none';
    startTime = Date.now();
    demo.start();
    updateCodeVisualizer();
  } else {
    errorSection.style.display = 'block';
    el('error').textContent = demo.error;
    console.error(demo.error);
  }
}

function calculateAnimationTime() {
  const duration = Date.now() - startTime;
  console.log('actual animation duration (ms):', duration);
  alert('COMPLETE!');
}

function establishOptionsFromInputs() {
  endVal = Number(el('endVal').value);
  options = {
    startVal: el('startVal').value,
    decimalPlaces: el('decimalPlaces').value,
    duration: Number(el('duration').value),
    useGrouping: el('useGrouping').checked,
    useIndianSeparators: el('useIndianSeparators').checked,
    easingFn: getEasingFn() ?? null,
    separator: el('separator').value,
    decimal: el('decimal').value,
    prefix: el('prefix').value,
    numerals: getNumerals(),
    onCompleteCallback: el('useOnComplete').checked ? calculateAnimationTime : null
  };
  for (const [key, value] of Object.entries(options)) {
    if (value === null) delete options[key];
  }
}

function updateCodeVisualizer() {
  establishOptionsFromInputs();
  code = '';
  if (options.easingFn) {
    code += 'const easingFn = ';
    for (const line of getEasingFnBody(options.easingFn).split('\n')) {
      code += `${line.replace(' ', '&nbsp;')}<br>`;
    }
  }
  const indentedLine = (keyPair, singleLine = false) => {
    const delimiter = singleLine ? ';' : ',';
    return `&emsp;&emsp;${keyPair}${delimiter}<br>`;
  };
  let opts = '';
  opts += (options.startVal !== '0') ? indentedLine(`startVal: ${options.startVal}`) : '';
  opts += (options.decimalPlaces !== '0') ? indentedLine(`decimalPlaces: ${options.decimalPlaces}`) : '';
  opts += (options.duration !== 2) ? indentedLine(`duration: ${options.duration}`) : '';
  opts += options.easingFn ? indentedLine('easingFn') : '';
  opts += options.useGrouping ? '' : indentedLine(`useGrouping: ${options.useGrouping}`);
  opts += options.useIndianSeparators ? indentedLine(`useIndianSeparators: ${options.useIndianSeparators}`) : '';
  opts += (options.separator !== ',') ? indentedLine(`separator: '${options.separator}'`) : '';
  opts += (options.decimal !== '.') ? indentedLine(`decimal: '${options.decimal}'`) : '';
  opts += options.prefix.length ? indentedLine(`prefix: '${options.prefix}'`) : '';
  opts += (options.numerals && options.numerals.length) ?
    indentedLine(`numerals: ${stringifyArray(options.numerals)}`) : '';
  opts += options.onCompleteCallback ? indentedLine('onCompleteCallback: methodToCallOnComplete') : '';

  if (opts.length) {
    code += `const options = {<br>${opts}};<br>`;
    code += `const demo = new CountUp('myTargetElement', ${endVal}, options);<br>`;
  } else {
    code += `const demo = new CountUp('myTargetElement', ${endVal});<br>`;
  }
  code += 'if (!demo.error) {<br>';
  code += indentedLine('demo.start()', true);
  code += '} else {<br>';
  code += indentedLine('console.error(demo.error)', true);
  code += '}';
  codeVisualizer.innerHTML = code;
}

// auto animate options
function getAutoAnimateOptions() {
  return {
    autoAnimate: true,
    autoAnimateOnce: el('autoAnimateOnce').checked,
    autoAnimateDelay: Number(el('autoAnimateDelay').value),
    onCompleteCallback: null,
  };
}

function recreateAutoAnimateDemos() {
  createScrollSpyCountUp();
  createHiddenAtInitCountUp();
  createInsideModalCountUp();
}

el('autoAnimateOnce').addEventListener('change', recreateAutoAnimateDemos);
el('autoAnimateDelay').addEventListener('change', recreateAutoAnimateDemos);

// scroll spy
function createScrollSpyCountUp() {
  if (scrollSpyCountUp) scrollSpyCountUp.onDestroy();
  establishOptionsFromInputs();
  const scrollSpyOptions = { ...options, ...getAutoAnimateOptions() };
  scrollSpyCountUp = new CountUp('scrollSpyTarget', endVal, scrollSpyOptions);
  if (scrollSpyCountUp.error) {
    console.error('scrollSpyCountUp error:', scrollSpyCountUp.error);
  }
}
createScrollSpyCountUp();
el('apply').addEventListener('click', createScrollSpyCountUp);
el('start').addEventListener('click', createScrollSpyCountUp);

// hidden at init
function createHiddenAtInitCountUp() {
  if (hiddenAtInitCountUp) hiddenAtInitCountUp.onDestroy();
  establishOptionsFromInputs();
  const hiddenOptions = { ...options, ...getAutoAnimateOptions() };
  hiddenAtInitCountUp = new CountUp('hiddenAtInitTarget', endVal, hiddenOptions);
  if (hiddenAtInitCountUp.error) {
    console.error('hiddenAtInitCountUp error:', hiddenAtInitCountUp.error);
  }
}
createHiddenAtInitCountUp();
el('apply').addEventListener('click', createHiddenAtInitCountUp);
el('start').addEventListener('click', createHiddenAtInitCountUp);

el('toggleVisibility').addEventListener('click', () => {
  const target = el('hiddenAtInitTarget');
  target.style.display = target.style.display === 'none' ? '' : 'none';
});

// inside modal
function createInsideModalCountUp() {
  if (insideModalCountUp) insideModalCountUp.onDestroy();
  establishOptionsFromInputs();
  const modalOptions = { ...options, ...getAutoAnimateOptions() };
  insideModalCountUp = new CountUp('modalTarget', endVal, modalOptions);
  if (insideModalCountUp.error) {
    console.error('insideModalCountUp error:', insideModalCountUp.error);
  }
}
createInsideModalCountUp();
el('apply').addEventListener('click', createInsideModalCountUp);
el('start').addEventListener('click', createInsideModalCountUp);

el('openModal').addEventListener('click', () => el('modalDialog').showModal());
el('closeModal').addEventListener('click', () => el('modalDialog').close());

// get current star count
try {
  const response = await fetch('https://api.github.com/repos/inorganik/CountUp.js');
  if (response.ok) {
    const data = await response.json();
    stars = data.stargazers_count;
    el('endVal').value = stars;
    createCountUp();
    createScrollSpyCountUp();
    createHiddenAtInitCountUp();
    createInsideModalCountUp();
  }
} catch (error) {
  console.error('error getting stars:', error);
  demo.start();
}
