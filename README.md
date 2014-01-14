countUp.js
==========

countUp.js is a dependency-free, lightweight JavaScript "class" that can be used to quickly create animations that display numerical data in a more interesting way.

### Usage:
add library via bower, component, or directly.

	require 'countUp'

create a new instance of countUp

    var numAnim = new countUp("SomeElementYouWantToAnimate", startVal, endVal, decimals, duration)

start the instance

	numAnim.start()

### Full example:
    var numAnim = new countUp("SomeElementYouWantToAnimate", 24.02, 99.99, 2, 1.5)
    numAnim.start()


##[Try the demo](http://inorganik.github.io/countUp.js)
