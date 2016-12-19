var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "@angular/core"], function (require, exports) {
    "use strict";
    var core_1 = require("@angular/core");
    var CountUpDirective = (function () {
        function CountUpDirective(el) {
            this.el = el;
        }
        Object.defineProperty(CountUpDirective.prototype, "endVal", {
            get: function () {
                return this._endVal;
            },
            set: function (value) {
                this._endVal = value;
                if (isNaN(value)) {
                    return;
                }
                if (!this._countUp) {
                    return;
                }
                this._countUp.update(value);
            },
            enumerable: true,
            configurable: true
        });
        CountUpDirective.prototype.ngOnInit = function () {
            this._countUp = this.createCountUp(this.startVal, this.endVal, this.decimals, this.duration);
            this.animate();
        };
        CountUpDirective.prototype.onClick = function () {
            if (this.reanimateOnClick) {
                this.animate();
            }
        };
        CountUpDirective.prototype.createCountUp = function (sta, end, dec, dur) {
            sta = sta || 0;
            if (isNaN(sta))
                sta = Number(sta.match(/[\d\-\.]+/g).join(''));
            end = end || 0;
            if (isNaN(end))
                end = Number(end.match(/[\d\-\.]+/g).join(''));
            dur = Number(dur) || 2;
            dec = Number(dec) || 0;
            var countUp = new CountUp(this.el.nativeElement, sta, end, dec, dur, this.options);
            if (end > 999) {
                countUp = new CountUp(this.el.nativeElement, sta, end - 100, dec, dur / 2, this.options);
            }
            return countUp;
        };
        CountUpDirective.prototype.animate = function () {
            var _this = this;
            this._countUp.reset();
            if (this.endVal > 999) {
                this._countUp.start(function () { return _this._countUp.update(_this.endVal); });
            }
            else {
                this._countUp.start();
            }
        };
        return CountUpDirective;
    }());
    __decorate([
        core_1.Input('countUp'),
        __metadata("design:type", Object)
    ], CountUpDirective.prototype, "options", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], CountUpDirective.prototype, "startVal", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [])
    ], CountUpDirective.prototype, "endVal", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], CountUpDirective.prototype, "duration", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], CountUpDirective.prototype, "decimals", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], CountUpDirective.prototype, "reanimateOnClick", void 0);
    __decorate([
        core_1.HostListener('click'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CountUpDirective.prototype, "onClick", null);
    CountUpDirective = __decorate([
        core_1.Directive({
            selector: '[countUp]'
        }),
        __param(0, core_1.Inject(core_1.ElementRef)),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], CountUpDirective);
    exports.CountUpDirective = CountUpDirective;
    var CountUpModule = (function () {
        function CountUpModule() {
        }
        return CountUpModule;
    }());
    CountUpModule = __decorate([
        core_1.NgModule({
            declarations: [CountUpDirective],
            exports: [CountUpDirective]
        }),
        __metadata("design:paramtypes", [])
    ], CountUpModule);
    exports.CountUpModule = CountUpModule;
});
