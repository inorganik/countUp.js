export interface CountUpOptions {
    startVal?: number;
    decimals?: number;
    duration?: number;
    useEasing?: boolean;
    useGrouping?: boolean;
    autoSmoothThreshold?: number;
    autoSmoothAmount?: number;
    separator?: string;
    decimal?: string;
    easingFn?: (t: number, b: number, c: number, d: number) => number;
    formattingFn?: (n: number) => string;
    prefix?: string;
    suffix?: string;
    numerals?: string[];
}
export declare class CountUp {
    private target;
    private endVal;
    private options?;
    version: string;
    private defaults;
    private el;
    private rAF;
    private startTime;
    private decimalMult;
    private timestamp;
    private remaining;
    private finalEndVal;
    callback: (args?: any) => any;
    error: string;
    startVal: number;
    duration: number;
    countDown: boolean;
    paused: boolean;
    frameVal: number;
    constructor(target: string | HTMLElement | HTMLInputElement, endVal: number, options?: CountUpOptions);
    start(callback?: (args?: any) => any): void;
    pauseResume(): void;
    reset(): void;
    update(newEndVal: any): void;
    count(timestamp: number): void;
    easeOutExpo(t: number, b: number, c: number, d: number): number;
    formatNumber(num: number): string;
    printValue(val: number): void;
    ensureNumber(n: any): boolean;
    validateValue(value: number): number;
}
