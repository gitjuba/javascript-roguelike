var { charWidthPixels, charHeightPixels } = require('./charmap')

// constants related to game dimensions and layout on screen

var canvasWidthChars = 80
var canvasHeightChars = 25

var canvasWidth = canvasWidthChars * charWidthPixels
var canvasHeight = canvasHeightChars * charHeightPixels

var mapWidth = 70
var mapHeight = 20

var statsWidth = canvasWidthChars - mapWidth
var statsHeight = mapHeight

var logWidth = canvasWidthChars
var logHeight = canvasHeightChars - mapHeight

module.exports = {
  canvasWidthChars,
  canvasHeightChars,
  canvasWidth,
  canvasHeight,
  mapWidth,
  mapHeight,
  statsWidth,
  statsHeight,
  logWidth,
  logHeight
}
