import { CountUp, CountUpPlugin } from './countUp';

describe('CountUp', () => {

  let countUp;
  let time;

  const getTargetHtml = () => document.getElementById('target')?.innerHTML;
  const resetRAF = () => {
    time = 0;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      time += 100;
      if (time < 2500) {
        return cb(time) as any;
      }
    });
  };

  beforeEach(() => {
    document.body.innerHTML =
      '<div>' +
      '  <h1 id="target"></h1>' +
      '</div>';

    countUp = new CountUp('target', { endVal: 100 });
    resetRAF();
  });

  describe('constructor', () => {

    it('should create for a valid target, and print startVal', () => {
      expect(countUp).toBeTruthy();
      expect(countUp.error.length).toBe(0);
      expect(getTargetHtml()).toEqual('0');
    });

    it('should set an error for a bad target', () => {
      countUp = new CountUp('notThere', { endVal: 100 });

      expect(countUp.error.length).toBeGreaterThan(0);
    });

    it('should set an error for a bad endVal', () => {
      const endVal = '%' as any;
      countUp = new CountUp('target', { endVal });

      expect(countUp.error.length).toBeGreaterThan(0);
    });

    it('should set an error for a bad startVal', () => {
      const startVal = 'oops' as any;
      countUp = new CountUp('target', { startVal, endVal: 100 });

      expect(countUp.error.length).toBeGreaterThan(0);
    });

    it('should return a value for version', () => {
      expect(countUp.version).toBeTruthy();
    });

    it('should support getting endVal from the target element', () => {
      document.body.innerHTML =
      '<div>' +
      '  <h1 id="target">1,500</h1>' +
      '</div>';

      countUp = new CountUp('target');
      expect(countUp.endVal).toBe(1500);
    });

    it('should set an error when endVal is omitted and not in target element', () => {
      document.body.innerHTML =
      '<div>' +
      '  <h1 id="target"></h1>' +
      '</div>';
      countUp = new CountUp('target');
      expect(countUp.error.length).toBeGreaterThan(0);
    });

    it('should not call parse when an endVal is passed as an option', () => {
      const parseSpy = jest.spyOn(CountUp.prototype, 'parse');

      countUp = new CountUp('target', { startVal: 100, endVal: 0 });
      expect(parseSpy).not.toHaveBeenCalled();
      parseSpy.mockRestore();
    });
  });

  describe('class methods', () => {
    describe('# start', () => {
      it('should count when start method is called', () => {
        countUp.start();

        expect(getTargetHtml()).toEqual('100');
      });

      it('should use a callback provided to start', () => {
        const cb = jest.fn();
        countUp.start(cb);

        expect(getTargetHtml()).toEqual('100');
        expect(cb).toHaveBeenCalled();
      });
    });

    describe('# pauseResume', () => {
      it('should pause when pauseResume is called', () => {
        countUp.start();
        countUp.pauseResume();

        expect(countUp.paused).toBeTruthy();
      });
    });

    describe('# reset', () => {
      it('should reset when reset is called', () => {
        countUp.start();
        countUp.reset();

        expect(getTargetHtml()).toEqual('0');
        expect(countUp.paused).toBeTruthy();
      });
    });

    describe('# update', () => {
      it('should update when update is called', () => {
        countUp.start();
        expect(getTargetHtml()).toEqual('100');

        resetRAF();
        countUp.update(200);
        expect(getTargetHtml()).toEqual('200');
      });
    });

    describe('# parse', () => {
      it('should properly parse numbers', () => {
        countUp = new CountUp('target', { endVal: 0 });
        const result0 = countUp.parse('14,921.00123');

        countUp = new CountUp('target', { endVal: 0, separator: '.', decimal: ',' });
        const result1 = countUp.parse('1.500,0');

        countUp = new CountUp('target', { endVal: 0, separator: ' ' });
        const result2 = countUp.parse('2 800');

        expect(result0).toEqual(14921.00123);
        expect(result1).toEqual(1500);
        expect(result2).toEqual(2800);
      });
    });
  });

  describe('various use-cases', () => {
    it('should handle large numbers', () => {
      countUp = new CountUp('target', { endVal: 6000 });
      const spy = jest.spyOn(countUp, 'determineDirectionAndSmartEasing');
      countUp.start();

      expect(getTargetHtml()).toEqual('6,000');
      expect(spy).toHaveBeenCalled();
    });

    it('should not use easing when specified with a large number (auto-smooth)', () => {
      countUp = new CountUp('target', { endVal: 6000, useEasing: false });
      const spy = jest.spyOn(countUp, 'easingFn');
      countUp.start();

      expect(getTargetHtml()).toEqual('6,000');
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should count down when endVal is less than startVal', () => {
      countUp = new CountUp('target', { startVal: 500, endVal: 10 });
      expect(getTargetHtml()).toEqual('500');
      countUp.start();

      expect(getTargetHtml()).toEqual('10');
    });

    it('should handle negative numbers', () => {
      countUp = new CountUp('target', { endVal: -500 });
      countUp.start();

      expect(getTargetHtml()).toEqual('-500');
    });

    it('should properly handle a zero duration', () => {
      countUp = new CountUp('target', { endVal: 2000, duration: 0 });
      countUp.start();

      expect(getTargetHtml()).toEqual('2,000');
    });

    it('should call the callback when finished if there is one', () => {
      const cb = jest.fn();
      countUp.start(cb);

      expect(getTargetHtml()).toEqual('100');
      expect(cb).toHaveBeenCalled();
    });
  });

  describe('options', () => {
    it('should respect the decimalPlaces option', () => {
      countUp = new CountUp('target', { endVal: 100, decimalPlaces: 2 });
      countUp.start();

      expect(getTargetHtml()).toEqual('100.00');
    });

    it('should respect the duration option', () => {
      countUp = new CountUp('target', { endVal: 100, duration: 1 });
      countUp.start();

      expect(getTargetHtml()).toEqual('100');
    });

    it('should respect the useEasing option', () => {
      countUp = new CountUp('target', { endVal: 100, useEasing: false });
      countUp.start();

      expect(getTargetHtml()).toEqual('100');
    });

    it('should respect the useGrouping option', () => {
      countUp = new CountUp('target', { endVal: 100000, useGrouping: false });
      countUp.start();

      expect(getTargetHtml()).toEqual('100000');
      resetRAF();

      countUp = new CountUp('target', { endVal: 1000000, useGrouping: true });
      countUp.start();

      expect(getTargetHtml()).toEqual('1,000,000');
    });

    it('should respect the useIndianSeparators option', () => {
      countUp = new CountUp('target', { endVal: 100000, useIndianSeparators: true });
      countUp.start();

      expect(getTargetHtml()).toEqual('1,00,000');
      resetRAF();

      countUp = new CountUp('target', { endVal: 10000000, useIndianSeparators: true });
      countUp.start();

      expect(getTargetHtml()).toEqual('1,00,00,000');
    });

    it('should respect the separator option', () => {
      countUp = new CountUp('target', { endVal: 10000, separator: ':' });
      countUp.start();

      expect(getTargetHtml()).toEqual('10:000');
    });

    it('should respect the decimal option', () => {
      countUp = new CountUp('target', { endVal: 100, decimal: ',', decimalPlaces: 1 });
      countUp.start();

      expect(getTargetHtml()).toEqual('100,0');
    });

    it('should respect the easingFn option', () => {
      const easeOutQuintic = jest.fn().mockReturnValue(100);
      countUp = new CountUp('target', { endVal: 100, easingFn: easeOutQuintic });
      countUp.start();

      expect(easeOutQuintic).toHaveBeenCalled();
      expect(getTargetHtml()).toEqual('100');
    });

    it('should respect the formattingFn option', () => {
      const formatter = jest.fn().mockReturnValue('~100~');
      countUp = new CountUp('target', { endVal: 100, formattingFn: formatter });
      countUp.start();

      expect(formatter).toHaveBeenCalled();
      expect(getTargetHtml()).toEqual('~100~');
    });

    it('should respect the prefix option', () => {
      countUp = new CountUp('target', { endVal: 100, prefix: '$' });
      countUp.start();

      expect(getTargetHtml()).toEqual('$100');
    });

    it('should respect the suffix option', () => {
      countUp = new CountUp('target', { endVal: 100, suffix: '!' });
      countUp.start();

      expect(getTargetHtml()).toEqual('100!');
    });

    it('should respect the numerals option', () => {
      const numerals = [')', '!', '@', '#', '$', '%', '^', '&', '*', '('];
      countUp = new CountUp('target', { endVal: 100, numerals });
      countUp.start();

      expect(getTargetHtml()).toEqual('!))');
    });

    it('should respect the onCompleteCallback option', () => {
      const options = { endVal: 100, onCompleteCallback: jest.fn() };
      const callbackSpy = jest.spyOn(options, 'onCompleteCallback');
      countUp = new CountUp('target', options);
      countUp.start();

      expect(getTargetHtml()).toEqual('100');
      expect(callbackSpy).toHaveBeenCalled();
    });

    it('should respect the onStartCallback option', () => {
      const options = { endVal: 100, onStartCallback: jest.fn() };
      const callbackSpy = jest.spyOn(options, 'onStartCallback');
      countUp = new CountUp('target', options);
      countUp.start();

      expect(callbackSpy).toHaveBeenCalled();
      expect(getTargetHtml()).toEqual('100');
    });

    it('should respect the plugin option', () => {
      const plugin: CountUpPlugin = {
        render: (el, result) => {
          el.innerHTML = result;
        }
      };
      countUp = new CountUp('target', {
        endVal: 1000,
        plugin,
        useGrouping: true
      });
      countUp.start();

      expect(getTargetHtml()).toEqual('1,000');
    });
  });
});
