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
        beforeEach(function () {
            document.body.innerHTML =
                '<div>' +
                    '  <h1 id="target"></h1>' +
                    '</div>';
            time = 0;
            jest.spyOn(window, 'requestAnimationFrame').mockImplementation(function (cb) {
                time += 100;
                if (time < 2000) {
                    return cb(time);
                }
            });
        });
        it('should create for a valid target and print startVal', function () {
            countUp = new countUp_1.CountUp('target', 100);
            expect(countUp).toBeTruthy();
            expect(countUp.error.length).toBe(0);
            expect(document.getElementById('target').innerHTML).toEqual('0');
        });
        it('should set an error for a bad target', function () {
            countUp = new countUp_1.CountUp('notThere', 100);
            expect(countUp.error.length).toBeGreaterThan(0);
        });
        it('should count when start method is called', function () {
            countUp = new countUp_1.CountUp('target', 100);
            countUp.start();
            expect(document.getElementById('target').innerHTML).toEqual('100');
        });
    });
});
