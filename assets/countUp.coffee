###
# Example:
# var numAnim = new countUp("SomeElementYouWantToAnimate", 99.99, 2, 1.5)
# numAnim.start()
###

window.requestAnimationFrame =
  window.requestAnimationFrame or 
  window.mozRequestAnimationFrame or
  window.webkitRequestAnimationFrame or 
  window.msRequestAnimationFrame

# target = id of Html element where counting occurs
# endVal = the value you want to arrive at
# decimals = number of decimal places in number, default 0
# duration = duration in seconds, default 2

countUp = (target, endVal, decimals, duration) ->

  @doc = document.getElementById(target)
  @dec = decimals * 10 or 0
  @duration = duration * 1000 or 2000
  @startTime = null
  @frameVal = 0

  # Robert Penner's easeOutExpo
  @easeOutExpo = (t, b, c, d) ->
    c * (-Math.pow(2, -10 * t / d ) + 1) + b

  @stepUp = (timestamp) ->
    @startTime = timestamp if @startTime is null

    progress = timestamp - @startTime
      
    # easing
    @frameVal = @easeOutExpo progress, 0, endVal, @duration
      
    # decimal
    if @dec > 0
      @frameVal = Math.round(@frameVal * @dec) / @dec
      @frameVal = if (@frameVal > endVal) then endVal else @frameVal
    
    @d.innerHTML = @addCommas @frameVal.toFixed decimals
            
    requestAnimationFrame @stepUp if progress < @duration
    else @d.innerHTML = @addCommas endVal.toFixed(decimals)

  @start = () ->
    # make sure endVal is a number
    requestAnimationFrame @stepUp unless isNaN(endVal) and endVal isnt null
    else
      console.log('countUp error: endVal is not a number')
      @d.innerHTML = '--'
    false

  @reset = () ->
    @d.innerHTML = 0

  @addCommas = (nStr) ->
    nStr += ''
    x = nStr.split('.')
    x1 = x[0]
    x2 = if x.length > 1 then "." + x[1] else ""
    rgx = /(\d+)(\d{3})/

    while rgx.test(x1)
      x1 = x1.replace(rgx, '$1' + ',' + '$2')

    x1 + x2
