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
    describe('CountUp', function () {
        var countUp;
        var time;
        var resetRAF = function () {
            time = 0;
            jest.spyOn(window, 'requestAnimationFrame').mockImplementation(function (cb) {
                time += 100;
                if (time < 2500) {
                    return cb(time);
                }
            });
        };
        beforeEach(function () {
            document.body.innerHTML =
                '<div>' +
                    '  <h1 id="target"></h1>' +
                    '</div>';
            countUp = new countUp_1.CountUp('target', 100);
            resetRAF();
        });
        describe('constructor', function () {
            it('should create for a valid target, and print startVal', function () {
                expect(countUp).toBeTruthy();
                expect(countUp.error.length).toBe(0);
                expect(document.getElementById('target').innerHTML).toEqual('0');
            });
            it('should set an error for a bad target', function () {
                countUp = new countUp_1.CountUp('notThere', 100);
                expect(countUp.error.length).toBeGreaterThan(0);
            });
            it('should set an error for a bad endVal', function () {
                var endVal = '%';
                countUp = new countUp_1.CountUp('target', endVal);
                expect(countUp.error.length).toBeGreaterThan(0);
            });
            it('should set an error for a bad startVal', function () {
                var startVal = 'oops';
                countUp = new countUp_1.CountUp('target', 100, { startVal: startVal });
                expect(countUp.error.length).toBeGreaterThan(0);
            });
            it('should return a value for version', function () {
                expect(countUp.version).toBeTruthy();
            });
        });
        describe('class methods', function () {
            it('should count when start method is called', function () {
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('100');
            });
            it('should pause when pauseResume is called', function () {
                countUp.start();
                // resetRAF();
                countUp.pauseResume();
                expect(countUp.paused).toBeTruthy();
            });
            it('should reset when reset is called', function () {
                countUp.start();
                countUp.reset();
                expect(document.getElementById('target').innerHTML).toEqual('0');
                expect(countUp.paused).toBeTruthy();
            });
            it('should update when update is called', function () {
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('100');
                resetRAF();
                countUp.update(200);
                expect(document.getElementById('target').innerHTML).toEqual('200');
            });
        });
        describe('various use-cases', function () {
            it('should handle large numbers', function () {
                countUp = new countUp_1.CountUp('target', 6000);
                var spy = jest.spyOn(countUp, 'determineIfWillAutoSmooth');
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('6,000');
                expect(spy).toHaveBeenCalled();
            });
            it('should not use easing when specified with a large number (auto-smooth)', function () {
                countUp = new countUp_1.CountUp('target', 6000, { useEasing: false });
                var spy = jest.spyOn(countUp, 'easingFn');
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('6,000');
                expect(spy).toHaveBeenCalledTimes(0);
            });
            it('should count down when endVal is less than startVal', function () {
                countUp = new countUp_1.CountUp('target', 10, { startVal: 500 });
                expect(document.getElementById('target').innerHTML).toEqual('500');
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('10');
            });
            it('should handle negative numbers', function () {
                countUp = new countUp_1.CountUp('target', -500);
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('-500');
            });
            it('should properly handle a zero duration', function () {
                countUp = new countUp_1.CountUp('target', 2000, { duration: 0 });
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('2,000');
            });
            it('should call the callback when finished if there is one', function () {
                var cb = jest.fn();
                countUp.start(cb);
                expect(document.getElementById('target').innerHTML).toEqual('100');
                expect(cb).toHaveBeenCalled();
            });
        });
        describe('options', function () {
            it('should respect the decimalPlaces option', function () {
                countUp = new countUp_1.CountUp('target', 100, { decimalPlaces: 2 });
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('100.00');
            });
            it('should respect the duration option', function () {
                countUp = new countUp_1.CountUp('target', 100, { duration: 1 });
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('100');
            });
            it('should respect the useEasing option', function () {
                countUp = new countUp_1.CountUp('target', 100, { useEasing: false });
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('100');
            });
            it('should respect the useGrouping option', function () {
                countUp = new countUp_1.CountUp('target', 10000, { useGrouping: false });
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('10000');
            });
            it('should respect the separator option', function () {
                countUp = new countUp_1.CountUp('target', 10000, { separator: ':' });
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('10:000');
            });
            it('should respect the separator option', function () {
                countUp = new countUp_1.CountUp('target', 10000, { separator: ':' });
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('10:000');
            });
            it('should respect the decimal option', function () {
                countUp = new countUp_1.CountUp('target', 100, { decimal: ',', decimalPlaces: 1 });
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('100,0');
            });
            it('should respect the easingFn option', function () {
                var easeOutQuintic = jest.fn().mockReturnValue(100);
                countUp = new countUp_1.CountUp('target', 100, { easingFn: easeOutQuintic });
                countUp.start();
                expect(easeOutQuintic).toHaveBeenCalled();
                expect(document.getElementById('target').innerHTML).toEqual('100');
            });
            it('should respect the formattingFn option', function () {
                var formatter = jest.fn().mockReturnValue('~100~');
                countUp = new countUp_1.CountUp('target', 100, { formattingFn: formatter });
                countUp.start();
                expect(formatter).toHaveBeenCalled();
                expect(document.getElementById('target').innerHTML).toEqual('~100~');
            });
            it('should respect the prefix option', function () {
                countUp = new countUp_1.CountUp('target', 100, { prefix: '$' });
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('$100');
            });
            it('should respect the suffix option', function () {
                countUp = new countUp_1.CountUp('target', 100, { suffix: '!' });
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('100!');
            });
            it('should respect the numerals option', function () {
                var numerals = [')', '!', '@', '#', '$', '%', '^', '&', '*', '('];
                countUp = new countUp_1.CountUp('target', 100, { numerals: numerals });
                countUp.start();
                expect(document.getElementById('target').innerHTML).toEqual('!))');
            });
        });
    });
});
