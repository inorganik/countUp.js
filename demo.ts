import { CountUp } from './dist/countUp.js';

let code, stars, demo;
const codeVisualizer = document.getElementById('codeVisualizer');

const showCodeAndPauseResume = () => {
  code = 'demo.pauseResume();';
  codeVisualizer.innerHTML = code;
  demo.pauseResume();
}
const showCodeAndReset = () => {
  code = 'demo.reset();';
  codeVisualizer.innerHTML = code;
  demo.reset();
}
const showCodeAndUpdate = () => {
  var updateVal = document.getElementById('updateVal').value;
  var num = updateVal ? updateVal : 0;
  code = 'demo.update('+num+');<br>';
  code += '// update method is useful for counting to large numbers. See README.';
  codeVisualizer.innerHTML = code;
  demo.update(num);
}
const toggleOnComplete = (checkbox) {
  useOnComplete = checkbox.checked;
  updateCodeVisualizer();
}
const toggleEasing = (checkbox) {
  useEasing = checkbox.checked
  easingFnsDropdown.disabled = !useEasing
  if (useEasing) {
    easingFnsDropdown.value = 'easeOutExpo';
    document.getElementById('easingFnPreview').value = "";
  }
  updateCodeVisualizer();
}
const toggleGrouping = (checkbox) {
  useGrouping = checkbox.checked;
  updateCodeVisualizer();
}
const methodToCallOnComplete = () => {
  console.log('COMPLETE!');
  alert('COMPLETE!');
}

const updateCodeVisualizer = () => {
  let startVal: any = input('startVal').value;
  startVal = Number(startVal.replace(',', '').replace(' ', ''));
  let endVal: any = input('endVal').value;
  endVal = Number(endVal.replace(',', '').replace(' ',''));
  const decimalPlaces = input('decimals').value,
    duration = input('duration').value,
    separator = input('separator').value,
    decimal = input('decimal').value,
    prefix = input('prefix').value,
    suffix = input('suffix').value,
    easingFn = getEasingFn(),
    easingFnBody = getEasingFnBody(easingFn),
    numerals = getNumerals();
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

const input = (id: string): HTMLInputElement => {
  return document.getElementById(id) as HTMLInputElement;
};

// get current star count
const repoInfoUrl = 'https://api.github.com/repos/inorganik/CountUp.js';
const getStars = new XMLHttpRequest();
getStars.open('GET', repoInfoUrl, true);
getStars.timeout = 5000;

getStars.onreadystatechange = const () {
  // 2: received headers,  3: loading, 4: done
  if (getStars.readyState === 4) {
    if (getStars.status === 200) {
      if (getStars.responseText !== 'undefined') {
        if (getStars.responseText.length > 0) {
          const data = JSON.parse(getStars.responseText);
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
