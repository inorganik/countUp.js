###*
  by @inorganik
###

window.countUp = class countUp

  @VERSION: '1.3.1'

  ###*
   * Count Up
   * 
   * @class
   * @param {number} target element selector or var of previously selected html element where counting occurs
   * @param {number} startVal The value you want to begin at
   * @param {number} endVal The value you want to arrive at
   * @param {number} [decimals=0] Tumber of decimal places
   * @param {number} [duration=2] Duration of animation in second
   * @param {object} [options] Optional object of options (see below)
   * 
  ###
  constructor: (target, startVal, endVal, decimals, duration, options) ->
    @polyFill()

    @root = {target, startVal, endVal, decimals, duration}

    @options = options extends
      useEasing: yes
      useGrouping: yes
      separator: ','
      decimal: '.'
      prefix: ''
      suffix: ''

    @options.useGrouping = false if @options.separator is ''

    @element   = if typeof target is 'string' then document.querySelector target else target
    @startVal  = +startVal
    @endVal    = +endVal
    @countDown = if startVal > endVal then true else false
    @startTime = null
    @timestamp = null
    @remaining = null
    @rAF       = null
    @frameVal  = @startVal
    @decimals  = Math.max 0, decimals or 0
    @dec       = 10 ** @decimals
    @duration  = duration * 1000 or 2000

    @printValue @startVal

  ###*
   * Make sure requestAnimationFrame and cancelAnimationFrame are defined
   * polyfill for browsers without native support
   * by Opera engineer Erik Möller
   * 
   * @method polyFill
   * @return
   *  
  ###
  polyFill: ->
    x        = 0
    lastTime = 0
    vendors  = ['webkit', 'moz', 'ms', 'o']

    while x < vendors.length and not window.requestAnimationFrame
      window.requestAnimationFrame = window["#{vendors[x]}RequestAnimationFrame"]
      window.cancelAnimationFrame  = window["#{vendors[x]}CancelAnimationFrame"] or window["#{vendors[x]}CancelRequestAnimationFrame"]
      x++

    unless window.requestAnimationFrame
      window.requestAnimationFrame = (callback, element) ->
        currTime   = new Date().getTime()
        timeToCall = Math.max 0, 16 - (currTime - lastTime)

        id = window.setTimeout ->
          callback currTime + timeToCall
        , timeToCall

        lastTime = currTime + timeToCall

        id

    unless window.cancelAnimationFrame
      window.cancelAnimationFrame = (id) ->
        clearTimeout id

  ###*
   * Print value to the target element
   * 
   * @method printValue
   * @param {number} value
   * @return
   *  
  ###
  printValue: (value) ->
    result = if not isNaN value then @formatNumber value else '--'

    if @element.tagName is 'INPUT'
      @element.value = result
    else
      @element.innerHTML = result

  ###*
   * 
   * @method easeOutExpo
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {number}
   *  
  ###
  easeOutExpo: (t, b, c, d) ->
    c * (-(2 ** (-10 * t / d)) + 1) * 1024 / 1023 + b

  ###*
   * 
   * @method count
   * @param {number} timestamp
   * @return {number}
   *  
  ###
  count: (timestamp) =>
    @startTime = timestamp if @startTime is null
    @timestamp = timestamp
    progress   = timestamp - @startTime
    @remaining = @duration - progress

    # To ease or not to ease
    if @options.useEasing
      if @countDown
        @frameVal = @startVal - @easeOutExpo progress, 0, (@startVal - @endVal), @duration
      else #@countDown
        @frameVal = @easeOutExpo progress, @startVal, @endVal - @startVal, @duration

    else #@options.useEasing
      if @countDown
        @frameVal = @startVal - (@startVal - @endVal) * (progress / @duration)
      else #@countDown
        @frameVal = @startVal + (@endVal - @startVal) * (progress / @duration)

    # Don't go past endVal since progress can exceed duration in the last frame
    if @countDown
      @frameVal = if @frameVal < @endVal then @endVal else @frameVal
    else #@countDown
      @frameVal = if @frameVal > @endVal then @endVal else @frameVal

    # Decimal
    @frameVal = Math.round(@frameVal * @dec) / @dec

    # Format and print value
    @printValue @frameVal

    # whether to cotinue
    if progress < @duration
      @rAF = requestAnimationFrame @count
    else #progress < @duration
      @callback() if @callback?

  ###*
   * 
   * @method start
   * @param {function} callback
   * @return {boolean}
   *  
  ###
  start: (callback) ->
    @callback = callback

    # Make sure values are valid
    if not isNaN(@endVal) and not isNaN @startVal
      @rAF = requestAnimationFrame @count
    else #isNaN @endVal and isNaN @startVal
      console.error 'countUp error: startVal or endVal is not a number'
      @printValue()

    false

  ###*
   * 
   * @method stop
   * @return
   *  
  ###
  stop: ->
    cancelAnimationFrame @rAF

  ###*
   * 
   * @method reset
   * @return
   *  
  ###
  reset: ->
    @startTime = null
    @startVal  = @root.startVal

    cancelAnimationFrame @rAF
    @printValue @startVal

  ###*
   * 
   * @method resume
   * @return
   *  
  ###
  resume: ->
    @stop()

    @startTime = null
    @duration  = @remaining
    @startVal  = @frameVal

    requestAnimationFrame @count

  ###*
   * 
   * @method resume
   * @return {string} formatted number
   *  
  ###
  formatNumber: (numberString) ->
    numberString = "#{numberString.toFixed @decimals}"

    x   = numberString.split '.'
    x1  = x[0]
    x2  = if x.length > 1 then @options.decimal + x[1] else ''
    rgx = /(\d+)(\d{3})/

    if @options.useGrouping
      while rgx.test x1
        x1 = x1.replace rgx, "$1#{@options.separator}$2"

    "#{@options.prefix}#{x1}#{x2}#{@options.suffix}"
