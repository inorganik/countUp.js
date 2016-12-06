declare function CountUp(target: string, startVal: number, endVal: number, decimals: number, duration: number, options: any): void;

declare module CountUp {
	var options: CountUpOptions;
	
	function version(): string;

	function printValue(value: any): void;

	function count(timestamp: any): void;

	// start your animation
	function start(callback: Function): boolean;

	// toggles pause/resume animation
	function pauseResume(): void;

	// reset to startVal so animation can be run again
	function reset(): void;

	// pass a new endVal and start animation
	function update(newEndVal: number): void;
}

interface CountUp {
	// target = id of html element or var of previously selected html element where counting occurs
	// startVal = the value you want to begin at
	// endVal = the value you want to arrive at
	// decimals = number of decimal places, default 0
	// duration = duration of animation in seconds, default 2
	// options = optional object of options (see below)
	new(target: string, startVal: number, endVal: number, decimals: number, duration: number, options: any): CountUp;
}

interface CountUpOptions {
	useEasing: boolean; // toggle easing
	useGrouping: boolean; // 1,000,000 vs 1000000
	separator: string; // character to use as a separator
	decimal: string; // character to use as a decimal
	easingFn: Function; // optional custom easing closure function, default is Robert Penner's easeOutExpo
	formattingFn: Function; // optional custom formatting function, default is self.formatNumber below
}

export = CountUp;
