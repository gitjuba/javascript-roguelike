var canvasWidthChars = 80
var canvasHeightChars = 25

var charWidthPixels = 9
var charHeightPixels = 14

function createCharacterSheet(imageFile) {
  var img = document.createElement('img')
  img.src = imageFile
  img.className = 'character-sheet'
  img.onload = function() {
    console.log('image loaded')
  }
  document.body.appendChild(img)
}

var charsImg = createCharacterSheet('Codepage-850_alpha.png')

var canvasWidth = canvasWidthChars * charWidthPixels
var canvasHeight = canvasHeightChars * charHeightPixels

function createContainer() {
  var div = document.createElement('div')
  div.className = 'container'
  document.body.appendChild(div)
  return div
}

var container = createContainer()

function createDrawingContext(id) {
  var canvas = document.createElement('canvas')
  canvas.className = 'game-canvas'
  canvas.setAttribute('id', id)
  canvas.setAttribute('width', canvasWidth)
  canvas.setAttribute('height', canvasHeight)
  canvas.style.transform = `translate(${canvasWidth / 2}px,${canvasHeight / 2}px)scale(2)`
  container.appendChild(canvas)
  var context = canvas.getContext('2d')
  return context
}

function Renderer(id, top, left, width, height) {
  this.top = top
  this.left = left
  this.width = width
  this.height = height

  this.context = createDrawingContext(id)

  this.drawChar = function(char, i, j) {
    if (!(char in charMap)) {
      throw new Error('invalid char: ' + char)
    }
    this.context.drawImage(
      charsImg,
      charOffsetX + charMap[char].j * charWidthPixels,
      charOffsetY + charMap[char].i * charHeightPixels,
      charWidthPixels,
      charHeightPixels,
      (this.left + j) * charWidthPixels,
      (this.top + i) * charHeightPixels,
      charWidthPixels,
      charHeightPixels
    )
  }

  this.drawText = function(text, i, j) {
    for (var k = 0; k < text.length; k++) {
      this.drawChar(text[k], i, j + k)
    }
  }

  this.drawTile = function(color, i, j) {
    this.context.fillStyle = color
    this.context.fillRect(
      (this.left + j) * charWidthPixels,
      (this.top + i) * charHeightPixels,
      charWidthPixels,
      charHeightPixels
    )
  }
}

var statsContext = createDrawingContext('stats')
var logContext = createDrawingContext('log')
var colorContext = createDrawingContext('color')
var visibleContext = createDrawingContext('visible')
var levelContext = createDrawingContext('level')
var seenContext = createDrawingContext('seen')
var objectContext = createDrawingContext('objects')
var debugContext = createDrawingContext('debug')

function Game() {

  this.updateState = function(event) { }
  this.render = function() {}
}

var game = new Game();

function gameLoop() {
  game.render()
  window.requestAnimationFrame(gameLoop)
}

window.addEventListener('keyup', function(e) {
  game.updateState(e)
})

window.requestAnimationFrame(gameLoop)
