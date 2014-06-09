# Changelog

### v 1.1.2 (6/9/14)

- Fixes a bug where start() -> stop() -> resume() -> reset() would reset to the number stopped at. Thanks to @youxiachai for finding this one

### v 1.1.1 (5/13/14)

- Fixes a bug where an empty separator (“”) specified in the options
object would cause the browser tab to become unresponsive if the endVal
was a 4+ digit number. Special thanks to @sgtmercs for finding this bug
and creating an issue.

### v 1.1.0 (2/21/14)

- now accepts an optional options object that allows for globalized number formatting
- you can now optionally set the character of the separator and the decimal
- grouping (ie, 1,000,000 vs 1000000) is now optional

### v 1.0.3 (2/7/14)

- fixed bug that caused start() not to work if reset() was previously called (oops)

### v 1.0.2 (1/30/14)

- now allows target to be either an id or var of a previously selected html element thanks to @jackrugile

### v 1.0.1 (1/30/14)

- fixed a bug that caused the resume method not to work if counting down

### v 1.0.0 (1/23/14)

- no changes, just officially made it a production version

### v 0.0.6 (1/17/14)

- added resume method
- format startVal on initialization

### v 0.0.5 (1/17/14)

- added stop method
- fixed reset method
- improved demo to include stop, reset, callback and code visualization

### v 0.0.4 (1/16/14)

- added callback thanks to @retasretas
- added requestAnimationFrame() polyfill to support IE8 and other browsers without native rAF support

### v 0.0.3 (1/13/14)

- added startVal param
- ability to count in either direction
- ability to toggle easing
- added minified version thanks to @HHSnopek

### v 0.0.2 (1/13/14)

- coffeescript version added thanks to @HHSnopek
- bower & component support
- changelog added
- bug fixes and improvements thanks to @lifthrasiir

### v 0.0.1 (12/31/13)

- initial release
