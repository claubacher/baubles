;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var randRgba = require('./randRgba')

function draw() {
  canvas = document.getElementById('main')
  ctx = canvas.getContext('2d')

  var initWidthInput = document.getElementById("stroke-width")
  var initWidth = Number(initWidthInput.value)
  initWidthInput.addEventListener("change", function () {
    initWidth = Number(initWidthInput.value)
  })

  var widthChange = {}
  var widthSignInput = document.getElementById("stroke-change")
  widthChange.increment = widthSignInput.value === "increment" ? true : false
  widthSignInput.addEventListener("change", function () {
    widthChange.increment = widthSignInput.value === "increment" ? true : false
  })
  var widthChangeAmtInput = document.getElementById("stroke-change-amt")
  widthChange.amount = Number(widthChangeAmtInput.value)
  widthChangeAmtInput.addEventListener("change", function () {
    widthChange.amount = Number(widthChangeAmtInput.value)
  })

  var initRadiusInput = document.getElementById("radius-width")
  var initRadius = Number(initRadiusInput.value)
  initRadiusInput.addEventListener("change", function () {
    initRadius = Number(initRadiusInput.value)
  })

  var radiusChange
  var radiusChangeAmtInput = document.getElementById("radius-change-amt")
  radiusChange = Number(radiusChangeAmtInput.value)
  radiusChangeAmtInput.addEventListener("change", function () {
    radiusChange = Number(radiusChangeAmtInput.value)
  })

  canvas.addEventListener("click", function(event) {
    var borderWidth = parseInt(window.getComputedStyle(canvas)["border-width"])
    var x     = event.x - canvas.offsetLeft - borderWidth
      , y     = event.y - canvas.offsetTop - borderWidth
      , color = "rgba" + randRgba()

    var ripple = new Ripple(ctx, x, y, color, initWidth, widthChange, initRadius, radiusChange)
    ripple.draw()
  }, false)

  document.getElementById("clear").addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  })
}

function Ripple(ctx, x, y, color, width, widthChange, radius, radiusChange) {
  this.ctx          = ctx
  this.x            = x
  this.y            = y
  this.color        = color
  this.width        = width
  this.widthChange  = widthChange
  this.radius       = radius
  this.radiusChange = radiusChange
}

Ripple.prototype.draw = function() {
  var that = this
  setInterval(function() {
    drawCircle(that.ctx, that.color, that.width, that.x, that.y, that.radius)
    if (that.widthChange.increment) {
      that.width += that.widthChange.amount
    } else {
      if (that.width - that.widthChange.amount < 0.5) {
        that.width *= 0.5
      } else {
        that.width -= that.widthChange.amount
      }
    }
    that.radius += that.radiusChange
  }, 50)
}

function drawCircle(ctx, color, width, x, y, r) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.arc(x, y, r, 0, 2 * Math.PI, true)
  ctx.stroke()
}

draw()

},{"./randRgba":2}],2:[function(require,module,exports){
module.exports = randRgba

//return a string representing a random rgba color
function randRgba() {
  return "(" + randUpTo255().toString() + ", " +
    randUpTo255().toString() + ", " +
    randUpTo255().toString() + ", " +
    randUpTo1().toString() + ")"
}

//return random integer from 0 to 255 (inclusive)
function randUpTo255() {
  return Math.floor(Math.random() * 256)
}

//return random one-decimal-place float from 0 to 1 (inclusive)
function randUpTo1() {
  var randUpTo10 = Math.floor(Math.random() * 11)
  return randUpTo10 / 10
}

},{}]},{},[1])
;