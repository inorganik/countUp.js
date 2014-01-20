countUp.js
==========

countUp.js is a dependency-free, lightweight JavaScript "class" that can be used to quickly create animations that display numerical data in a more interesting way.

### Usage:

```js
var numAnim = new countUp("SomeElementYouWantToAnimate", 24.02, 99.99, 2, 1.5)
numAnim.start()
```

with optional callback:

```js
numAnim.start(someMethodToCallOnComplete);
```

other methods:
```js
numAnim.stop(); //stops the counter
numAnim.restart(); //restarts the counter after being stopped
```

##[Try the demo](http://inorganik.github.io/countUp.js)
