var {
  charOffsetX,
  charOffsetY,
  charWidthPixels,
  charHeightPixels,
  charMap
} = require('./charmap')

var {
  canvasWidth,
  canvasHeight
} = require('./layout')

function Renderer(id, top, left, width, height) {
  this.id = id

  this.top = top
  this.left = left
  this.width = width
  this.height = height

  this.context = null

  this.init = function(container, charSheet) {
    var canvas = document.createElement('canvas')
    canvas.className = 'game-canvas'
    canvas.setAttribute('id', id)
    canvas.setAttribute('width', canvasWidth)
    canvas.setAttribute('height', canvasHeight)
    canvas.style.transform = `translate(${canvasWidth / 2}px,${canvasHeight / 2}px)scale(2)`
    container.appendChild(canvas)

    this.context = canvas.getContext('2d')
    this.charSheet = charSheet

    return this
  }

  this.clear = function() {
    this.context.clearRect(0, 0, canvasWidth, canvasHeight)
  }

  this.drawChar = function(char, i, j) {
    if (!(char in charMap)) {
      throw new Error('invalid char: ' + char)
    }
    this.context.drawImage(
      this.charSheet,
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

  this.drawText = function(text, color, i, j) {
    // negative i means count lines from bottom
    for (var k = 0; k < text.length; k++) {
      this.drawColoredChar(text[k], color, i >= 0 ? i : this.height + i, j + k)
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

  this.clearTile = function(i, j) {
    this.context.clearRect(
      (this.left + j) * charWidthPixels,
      (this.top + i) * charHeightPixels,
      charWidthPixels,
      charHeightPixels
    )
  }

  this.drawColoredChar = function(char, color, i, j) {
    this.drawTile(color, i, j)
    this.drawChar(char, i, j)
  }

  this.fillWithChar = function(char) {
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        this.drawChar(char, i, j)
      }
    }
  }
}

module.exports = Renderer
