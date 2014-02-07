###
# 
# countUp.js
# by @inorganik
# v 1.0.3
#
# Example:
# numAnim = new countUp "SomeElementYouWantToAnimate", 99.99, 2, 1.5
# numAnim.start()
#
###

# target = id of Html element where counting occurs
# startVal = the value you want to start at
# endVal = the value you want to arrive at
# decimals = number of decimal places in number, default 0
# duration = duration in seconds, default 2

countUp = (target, startVal, endVal, decimals, duration) ->

  lastTime = 0
  vendors = [
    'webkit'
    'moz'
    'ms'
  ]

  #toggle easing
  @useEasing = true
  @doc = if (typeof target == 'string') then document.getElementById target else target
  @startVal = Number startVal  
  endVal = Number endVal
  @countDown = if (startVal > endVal) then true else false
  decimals = Math.max(0, decimals or 0)
  @dec = Math.pow(10, decimals)
  @duration = duration * 1000 or 2000
  @startTime = null
  @remaining = null
  @frameVal = @startVal
  @rAF = null

  # make sure requestAnimationFrame and cancelAnimationFrame are defined
  # polyfill for browsers without native support
  # by Opera engineer Erik Möller
  while x < vendors.length and not window.requestAnimationFrame
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']

  unless window.requestAnimationFrame
    window.requestAnimationFrame = (callback, element) ->
      currTime = new Date().getTime()
      timeToCall = Math.max 0, 16 - (currTime - lastTime)

      id = window.setTimeout(->
        callback currTime + timeToCall
      , timeToCall)

      lastTime = currTime + timeToCall
      id

  unless window.cancelAnimationFrame
    window.cancelAnimationFrame = (id) ->
      clearTimeout id

  # Robert Penner's easeOutExpo
  @easeOutExpo = (t, b, c, d) ->
    c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b

  @count = (timestamp) ->
    @startTime = timestamp if @startTime is null

    @timestamp = timestamp

    progress = timestamp - @startTime
      
    # to ease or not to ease is the question
    if @useEasing
      if @countDown
        i = @easeOutExpo progress, 0, @startVal - endVal, @duration
        @frameVal = @startVal - i
      else
        @frameVal = @easeOutExpo(progress, @startVal, endVal - @startVal, @duration)
    else
      if @countDown
        i = (startVal - endVal) * (progress / @duration)
        @frameVal = @startVal - i
      else
        @frameVal = @startVal + (endVal - @startVal) * (progress / @duration)
        
    # decimal
    @frameVal = Math.round(@frameVal * @dec) / @dec

    # don't go past enVal since progress can exceed duration in last grame   
    if @countDown
      @frameVal = if (@framVal < endVal) then endVal else @frameVal
    else
      @frameVal = if (@framVal > endVal) then endVal else @frameVal

    # formate and print value
    @doc.innerHTML = @addCommas @frameVal.toFixed(decimals)

    # weather to continue
    if progress < @duration
      @rAF = requestAnimationFrame @count
    else
      @callback() if @callback?

  @start = (callback) ->
    @callback = callback
    # make sure endVal is a number
    requestAnimationFrame @count unless isNaN(endVal) and isNan(startVal) isnt null
    else
      console.log('countUp error: startVal or endVal is not a number')
      @doc.innerHTML = '--'
    false

  @stop = () ->
    cancelAnimationFrame @rAF

  @reset = () ->
    @startTime = null
    cancelAnimationFrame @rAF
    @doc.innerHTML = @addCommas @startVal.toFixed(decimals)

  @resume = () ->
    @startTime = null
    @duration = @remaining
    @startVal = @framVal
    requestAnimationFrame @count

  @addCommas = (nStr) ->
    nStr += ''
    x = nStr.split('.')
    x1 = x[0]
    x2 = if x.length > 1 then "." + x[1] else ''
    rgx = /(\d+)(\d{3})/

    while rgx.test(x1)
      x1 = x1.replace(rgx, '$1' + ',' + '$2')

    x1 + x2

  # format startVal on initialization
  @doc.innerHTML = @addCommas @startVal.toFixed(decimals)
