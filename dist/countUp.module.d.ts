import { ElementRef, OnInit } from '@angular/core';
export declare class CountUpDirective implements OnInit {
    private el;
    options: any;
    startVal: number;
    private _endVal;
    endVal: number;
    duration: number;
    decimals: number;
    reanimateOnClick: boolean;
    ngOnInit(): void;
    onClick(): void;
    private _countUp;
    constructor(el: ElementRef);
    private createCountUp(sta, end, dec, dur);
    private animate();
}
export declare class CountUpModule {
}
