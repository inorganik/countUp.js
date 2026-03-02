export interface CountUpOptions {
    /** Number to start at @default 0 */
    startVal?: number;
    /** Number of decimal places @default 0 */
    decimalPlaces?: number;
    /** Animation duration in seconds @default 2 */
    duration?: number;
    /** Example: 1,000 vs 1000 @default true */
    useGrouping?: boolean;
    /** Example: 1,00,000 vs 100,000 @default false */
    useIndianSeparators?: boolean;
    /** Ease animation @default true */
    useEasing?: boolean;
    /** Smooth easing for large numbers above this if useEasing @default 999 */
    smartEasingThreshold?: number;
    /** Amount to be eased for numbers above threshold @default 333 */
    smartEasingAmount?: number;
    /** Grouping separator @default ',' */
    separator?: string;
    /** Decimal character @default '.' */
    decimal?: string;
    /** Easing function for animation @default easeOutExpo */
    easingFn?: (t: number, b: number, c: number, d: number) => number;
    /** Custom function to format the result */
    formattingFn?: (n: number) => string;
    /** Text prepended to result */
    prefix?: string;
    /** Text appended to result */
    suffix?: string;
    /** Numeral glyph substitution */
    numerals?: string[];
    /** Callback called when animation completes */
    onCompleteCallback?: () => any;
    /** Callback called when animation starts */
    onStartCallback?: () => any;
    /** Plugin for alternate animations */
    plugin?: CountUpPlugin;
    /** Trigger animation when target becomes visible @default false */
    autoAnimate?: boolean;
    /** Delay in ms after target comes into view @default 200 */
    animationDelay?: number;
    /** Run animation only once @default false */
    animateOnce?: boolean;
    /** @deprecated Please use autoAnimate instead */
    enableScrollSpy?: boolean;
    /** @deprecated Please use animationDelay instead */
    scrollSpyDelay?: number;
    /** @deprecated Please use animateOnce instead */
    scrollSpyOnce?: boolean;
}
export declare interface CountUpPlugin {
    render(elem: HTMLElement, formatted: string): void;
}
export declare class CountUp {
    private endVal?;
    options?: CountUpOptions;
    version: string;
    private defaults;
    private rAF;
    private startTime;
    private remaining;
    private finalEndVal;
    private useEasing;
    private countDown;
    private observer;
    el: HTMLElement | HTMLInputElement;
    formattingFn: (num: number) => string;
    easingFn?: (t: number, b: number, c: number, d: number) => number;
    error: string;
    startVal: number;
    duration: number;
    paused: boolean;
    frameVal: number;
    once: boolean;
    constructor(target: string | HTMLElement | HTMLInputElement, endVal?: number | null, options?: CountUpOptions);
    private setupObserver;
    unobserve(): void;
    /**
     * Smart easing works by breaking the animation into 2 parts, the second part being the
     * smartEasingAmount and first part being the total amount minus the smartEasingAmount. It works
     * by disabling easing for the first part and enabling it on the second part. It is used if
     * useEasing is true and the total animation amount exceeds the smartEasingThreshold.
     */
    private determineDirectionAndSmartEasing;
    start(callback?: (args?: any) => any): void;
    pauseResume(): void;
    reset(): void;
    update(newEndVal: string | number): void;
    count: (timestamp: number) => void;
    printValue(val: number): void;
    ensureNumber(n: any): boolean;
    validateValue(value: string | number): number;
    private resetDuration;
    formatNumber: (num: number) => string;
    easeOutExpo: (t: number, b: number, c: number, d: number) => number;
    parse(number: string): number;
}
