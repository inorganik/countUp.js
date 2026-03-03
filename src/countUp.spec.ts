import { CountUp, CountUpPlugin } from './countUp';

type IntersectionCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

class MockIntersectionObserver {
  callback: IntersectionCallback;
  elements: Element[] = [];
  static instances: MockIntersectionObserver[] = [];

  constructor(callback: IntersectionCallback, _options?: IntersectionObserverInit) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }
  observe(el: Element) { this.elements.push(el); }
  unobserve(el: Element) { this.elements = this.elements.filter(e => e !== el); }
  disconnect() { this.elements = []; }

  trigger(isIntersecting: boolean) {
    this.callback(this.elements.map(target => ({ isIntersecting, target } as Partial<IntersectionObserverEntry>)));
  }
}

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

    (window as any).IntersectionObserver = MockIntersectionObserver;
    MockIntersectionObserver.instances = [];

    countUp = new CountUp('target', 100);
    resetRAF();
  });

  describe('constructor', () => {

    it('should create for a valid target, and print startVal', () => {
      expect(countUp).toBeTruthy();
      expect(countUp.error.length).toBe(0);
      expect(getTargetHtml()).toEqual('0');
    });

    it('should set an error for a bad target', () => {
      countUp = new CountUp('notThere', 100);

      expect(countUp.error.length).toBeGreaterThan(0);
    });

    it('should set an error for a bad endVal', () => {
      const endVal = '%' as any;
      countUp = new CountUp('target', endVal);

      expect(countUp.error.length).toBeGreaterThan(0);
    });

    it('should set an error for a bad startVal', () => {
      const startVal = 'oops' as any;
      countUp = new CountUp('target', 100, { startVal });

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

    it('should not call parse when an endVal is passed to the constructor', () => {
      const parseSpy = jest.spyOn(CountUp.prototype, 'parse');

      countUp = new CountUp('target', 0, { startVal: 100 });
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

    describe('# onDestroy', () => {
      it('should cancel a running animation', () => {
        const cancelSpy = jest.spyOn(window, 'cancelAnimationFrame');
        countUp.start();
        countUp.onDestroy();

        expect(cancelSpy).toHaveBeenCalled();
      });

      it('should set paused to true', () => {
        countUp.start();
        expect(countUp.paused).toBe(false);

        countUp.onDestroy();
        expect(countUp.paused).toBe(true);
      });

      it('should disconnect the observer', () => {
        countUp = new CountUp('target', 100, { autoAnimate: true });
        const observer = MockIntersectionObserver.instances[MockIntersectionObserver.instances.length - 1];
        const disconnectSpy = jest.spyOn(observer, 'disconnect');

        countUp.onDestroy();
        expect(disconnectSpy).toHaveBeenCalled();
      });

      it('should clear onCompleteCallback', () => {
        const cb = jest.fn();
        countUp = new CountUp('target', 100, { onCompleteCallback: cb });

        countUp.onDestroy();
        expect(countUp.options.onCompleteCallback).toBeNull();
      });

      it('should clear onStartCallback', () => {
        const cb = jest.fn();
        countUp = new CountUp('target', 100, { onStartCallback: cb });

        countUp.onDestroy();
        expect(countUp.options.onStartCallback).toBeNull();
      });

      it('should prevent onCompleteCallback from firing after destroy', () => {
        const cb = jest.fn();
        countUp = new CountUp('target', 100, { onCompleteCallback: cb });
        countUp.onDestroy();

        resetRAF();
        countUp.start();
        expect(cb).not.toHaveBeenCalled();
      });

      it('should be safe to call on a fresh instance', () => {
        countUp = new CountUp('target', 100);
        expect(() => countUp.onDestroy()).not.toThrow();
        expect(countUp.paused).toBe(true);
      });
    });

    describe('# parse', () => {
      it('should properly parse numbers', () => {
        countUp = new CountUp('target', 0);
        const result0 = countUp.parse('14,921.00123');

        countUp = new CountUp('target', 0, { separator: '.', decimal: ',' });
        const result1 = countUp.parse('1.500,0');

        countUp = new CountUp('target', 0, { separator: ' ' });
        const result2 = countUp.parse('2 800');

        expect(result0).toEqual(14921.00123);
        expect(result1).toEqual(1500);
        expect(result2).toEqual(2800);
      });
    });
  });

  describe('various use-cases', () => {
    it('should handle large numbers', () => {
      countUp = new CountUp('target', 6000);
      const spy = jest.spyOn(countUp, 'determineDirectionAndSmartEasing');
      countUp.start();

      expect(getTargetHtml()).toEqual('6,000');
      expect(spy).toHaveBeenCalled();
    });

    it('should not use easing when specified with a large number (auto-smooth)', () => {
      countUp = new CountUp('target', 6000, { useEasing: false });
      const spy = jest.spyOn(countUp, 'easingFn');
      countUp.start();

      expect(getTargetHtml()).toEqual('6,000');
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should count down when endVal is less than startVal', () => {
      countUp = new CountUp('target', 10, { startVal: 500 });
      expect(getTargetHtml()).toEqual('500');
      countUp.start();

      expect(getTargetHtml()).toEqual('10');
    });

    it('should handle negative numbers', () => {
      countUp = new CountUp('target', -500);
      countUp.start();

      expect(getTargetHtml()).toEqual('-500');
    });

    it('should properly handle a zero duration', () => {
      countUp = new CountUp('target', 2000, { duration: 0 });
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
      countUp = new CountUp('target', 100, { decimalPlaces: 2 });
      countUp.start();

      expect(getTargetHtml()).toEqual('100.00');
    });

    it('should respect the duration option', () => {
      countUp = new CountUp('target', 100, { duration: 1 });
      countUp.start();

      expect(getTargetHtml()).toEqual('100');
    });

    it('should respect the useEasing option', () => {
      countUp = new CountUp('target', 100, { useEasing: false });
      countUp.start();

      expect(getTargetHtml()).toEqual('100');
    });

    it('should respect the useGrouping option', () => {
      countUp = new CountUp('target', 100000, { useGrouping: false });
      countUp.start();

      expect(getTargetHtml()).toEqual('100000');
      resetRAF();

      countUp = new CountUp('target', 1000000, { useGrouping: true });
      countUp.start();

      expect(getTargetHtml()).toEqual('1,000,000');
    });

    it('should respect the useIndianSeparators option', () => {
      countUp = new CountUp('target', 100000, { useIndianSeparators: true });
      countUp.start();

      expect(getTargetHtml()).toEqual('1,00,000');
      resetRAF();

      countUp = new CountUp('target', 10000000, { useIndianSeparators: true });
      countUp.start();

      expect(getTargetHtml()).toEqual('1,00,00,000');
    });

    it('should respect the separator option', () => {
      countUp = new CountUp('target', 10000, { separator: ':' });
      countUp.start();

      expect(getTargetHtml()).toEqual('10:000');
    });

    it('should respect the decimal option', () => {
      countUp = new CountUp('target', 100, { decimal: ',', decimalPlaces: 1 });
      countUp.start();

      expect(getTargetHtml()).toEqual('100,0');
    });

    it('should respect the easingFn option', () => {
      const easeOutQuintic = jest.fn().mockReturnValue(100);
      countUp = new CountUp('target', 100, { easingFn: easeOutQuintic });
      countUp.start();

      expect(easeOutQuintic).toHaveBeenCalled();
      expect(getTargetHtml()).toEqual('100');
    });

    it('should respect the formattingFn option', () => {
      const formatter = jest.fn().mockReturnValue('~100~');
      countUp = new CountUp('target', 100, { formattingFn: formatter });
      countUp.start();

      expect(formatter).toHaveBeenCalled();
      expect(getTargetHtml()).toEqual('~100~');
    });

    it('should respect the prefix option', () => {
      countUp = new CountUp('target', 100, { prefix: '$' });
      countUp.start();

      expect(getTargetHtml()).toEqual('$100');
    });

    it('should respect the suffix option', () => {
      countUp = new CountUp('target', 100, { suffix: '!' });
      countUp.start();

      expect(getTargetHtml()).toEqual('100!');
    });

    it('should respect the numerals option', () => {
      const numerals = [')', '!', '@', '#', '$', '%', '^', '&', '*', '('];
      countUp = new CountUp('target', 100, { numerals });
      countUp.start();

      expect(getTargetHtml()).toEqual('!))');
    });

    it('should respect the onCompleteCallback option', () => {
      const options = { onCompleteCallback: jest.fn() };
      const callbackSpy = jest.spyOn(options, 'onCompleteCallback');
      countUp = new CountUp('target', 100, options);
      countUp.start();

      expect(getTargetHtml()).toEqual('100');
      expect(callbackSpy).toHaveBeenCalled();
    });

    it('should respect the onStartCallback option', () => {
      const options = { onStartCallback: jest.fn() };
      const callbackSpy = jest.spyOn(options, 'onStartCallback');
      countUp = new CountUp('target', 100, options);
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
      countUp = new CountUp('target', 1000, {
        plugin,
        useGrouping: true
      });
      countUp.start();

      expect(getTargetHtml()).toEqual('1,000');
    });
  });

  describe('autoAnimate (IntersectionObserver)', () => {

    beforeEach(() => {
      jest.useFakeTimers({ doNotFake: ['requestAnimationFrame'] });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should create an IntersectionObserver when autoAnimate is true', () => {
      countUp = new CountUp('target', 100, { autoAnimate: true });

      expect(MockIntersectionObserver.instances.length).toBe(1);
      expect(MockIntersectionObserver.instances[0].elements).toContain(countUp.el);
    });

    it('should not create an observer when autoAnimate is false', () => {
      MockIntersectionObserver.instances = [];
      countUp = new CountUp('target', 100);

      expect(MockIntersectionObserver.instances.length).toBe(0);
    });

    it('should start animation when element becomes visible', () => {
      countUp = new CountUp('target', 100, { autoAnimate: true, autoAnimateDelay: 0 });
      resetRAF();
      const observer = MockIntersectionObserver.instances[0];

      observer.trigger(true);
      jest.advanceTimersByTime(0);

      expect(getTargetHtml()).toEqual('100');
    });

    it('should respect autoAnimateDelay before starting', () => {
      countUp = new CountUp('target', 100, { autoAnimate: true, autoAnimateDelay: 500 });
      resetRAF();
      const startSpy = jest.spyOn(countUp, 'start');
      const observer = MockIntersectionObserver.instances[0];

      observer.trigger(true);
      expect(startSpy).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      expect(startSpy).toHaveBeenCalled();
    });

    it('should reset when element goes out of view', () => {
      countUp = new CountUp('target', 100, { autoAnimate: true, autoAnimateDelay: 0 });
      resetRAF();
      const observer = MockIntersectionObserver.instances[0];

      observer.trigger(true);
      jest.advanceTimersByTime(0);
      expect(getTargetHtml()).toEqual('100');

      observer.trigger(false);
      expect(countUp.paused).toBe(true);
      expect(getTargetHtml()).toEqual('0');
    });

    it('should disconnect observer when autoAnimateOnce is true', () => {
      countUp = new CountUp('target', 100, { autoAnimate: true, autoAnimateOnce: true, autoAnimateDelay: 0 });
      const observer = MockIntersectionObserver.instances[0];
      const disconnectSpy = jest.spyOn(observer, 'disconnect');

      observer.trigger(true);
      jest.advanceTimersByTime(0);

      expect(disconnectSpy).toHaveBeenCalled();
      expect(countUp.once).toBe(true);
    });

    it('should not disconnect observer when autoAnimateOnce is false', () => {
      countUp = new CountUp('target', 100, { autoAnimate: true, autoAnimateOnce: false, autoAnimateDelay: 0 });
      const observer = MockIntersectionObserver.instances[0];
      const disconnectSpy = jest.spyOn(observer, 'disconnect');

      observer.trigger(true);
      jest.advanceTimersByTime(0);

      expect(disconnectSpy).not.toHaveBeenCalled();
    });

    it('should support multiple independent instances', () => {
      document.body.innerHTML =
        '<h1 id="target1"></h1>' +
        '<h1 id="target2"></h1>';
      MockIntersectionObserver.instances = [];

      const cu1 = new CountUp('target1', 50, { autoAnimate: true, autoAnimateDelay: 0 });
      const cu2 = new CountUp('target2', 200, { autoAnimate: true, autoAnimateDelay: 0 });

      expect(MockIntersectionObserver.instances.length).toBe(2);

      const obs1 = MockIntersectionObserver.instances[0];
      const obs2 = MockIntersectionObserver.instances[1];

      expect(obs1.elements).toContain(cu1.el);
      expect(obs2.elements).toContain(cu2.el);
      expect(obs1).not.toBe(obs2);

      resetRAF();
      obs1.trigger(true);
      jest.advanceTimersByTime(0);
      expect(document.getElementById('target1')!.innerHTML).toEqual('50');
      expect(cu2.paused).toBe(true);
    });

    it('should allow cleanup via unobserve()', () => {
      countUp = new CountUp('target', 100, { autoAnimate: true });
      const observer = MockIntersectionObserver.instances[0];
      const disconnectSpy = jest.spyOn(observer, 'disconnect');

      countUp.unobserve();
      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('should map deprecated enableScrollSpy to autoAnimate', () => {
      countUp = new CountUp('target', 100, { enableScrollSpy: true });
      expect(countUp.options.autoAnimate).toBe(true);
      expect(MockIntersectionObserver.instances.length).toBe(1);
    });
  });
});
