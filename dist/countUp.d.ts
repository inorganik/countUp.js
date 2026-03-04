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
    /** Animation delay in ms after auto-animate triggers @default 200 */
    autoAnimateDelay?: number;
    /** Run animation only once for auto-animate triggers @default false */
    autoAnimateOnce?: boolean;
    /** @deprecated Please use autoAnimate instead */
    enableScrollSpy?: boolean;
    /** @deprecated Please use autoAnimateDelay instead */
    scrollSpyDelay?: number;
    /** @deprecated Please use autoAnimateOnce instead */
    scrollSpyOnce?: boolean;
}
export declare interface CountUpPlugin {
    render(elem: HTMLElement, formatted: string): void;
}
/**
 * Animates a number by counting to it.
 * playground: stackblitz.com/edit/countup-typescript
 *
 * @param target - id of html element, input, svg text element, or DOM element reference where counting occurs.
 * @param endVal - the value you want to arrive at.
 * @param options - optional configuration object for fine-grain control
 */
export declare class CountUp {
    private endVal?;
    options?: CountUpOptions;
    version: string;
    private static observedElements;
    private defaults;
    private rAF;
    private autoAnimateTimeout;
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
    /** Set up an IntersectionObserver to auto-animate when the target element appears. */
    private setupObserver;
    /** Disconnect the IntersectionObserver and stop watching this element. */
    unobserve(): void;
    /** Teardown: cancel animation, disconnect observer, clear callbacks. */
    onDestroy(): void;
    /**
     * Smart easing works by breaking the animation into 2 parts, the second part being the
     * smartEasingAmount and first part being the total amount minus the smartEasingAmount. It works
     * by disabling easing for the first part and enabling it on the second part. It is used if
     * useEasing is true and the total animation amount exceeds the smartEasingThreshold.
     */
    private determineDirectionAndSmartEasing;
    /** Start the animation. Optionally pass a callback that fires on completion. */
    start(callback?: (args?: any) => any): void;
    /** Toggle pause/resume on the animation. */
    pauseResume(): void;
    /** Reset to startVal so the animation can be run again. */
    reset(): void;
    /** Pass a new endVal and start the animation. */
    update(newEndVal: string | number): void;
    /** Animation frame callback — advances the value each frame. */
    count: (timestamp: number) => void;
    /** Format and render the given value to the target element. */
    printValue(val: number): void;
    /** Return true if the value is a finite number. */
    ensureNumber(n: any): boolean;
    /** Validate and convert a value to a number, setting an error if invalid. */
    validateValue(value: string | number): number;
    /** Reset startTime, duration, and remaining to their initial values. */
    private resetDuration;
    /** Default number formatter with grouping, decimals, prefix/suffix, and numeral substitution. */
    formatNumber: (num: number) => string;
    /**
     * Default easing function (easeOutExpo).
     * @param t current time
     * @param b beginning value
     * @param c change in value
     * @param d duration
     */
    easeOutExpo: (t: number, b: number, c: number, d: number) => number;
    /** Parse a formatted string back to a number using the current separator/decimal options. */
    parse(number: string): number;
}
