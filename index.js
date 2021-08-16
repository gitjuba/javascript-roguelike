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
    startGame()
  }
  document.body.appendChild(img)
  return img
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

  this.clear = function() {
    this.context.clearRect(0, 0, canvasWidth, canvasHeight)
  }

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

  this.fillWithChar = function(char) {
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        this.drawChar(char, i, j)
      }
    }
  }
}

var mapWidth = 70
var mapHeight = 20

function createEmptyTileMap() {
  var tileMap = Array(mapHeight)
  for (var i = 0; i < mapHeight; i++) {
    tileMap[i] = Array(mapWidth)
    for (var j = 0; j < mapWidth; j++) {
      tileMap[i][j] = '#'
    }
  }
  return tileMap
}

function Level(params) {
  this.map = generateLevel(mapWidth, mapHeight, params)
  this.tileMap = createEmptyTileMap()

  this.seenMap = this.tileMap.map(row => row.map(() => false))
  this.isOccupied = this.tileMap.map(row => row.map(tile => (tile == '#')))

  this.monsters = []
  for (var iMonster = 0; iMonster < 5; iMonster++) {
    var position
    do {
      position = getRandomRoomPosition(this.map)
    } while (this.isOccupied[pos.y][pos.x])
    this.monsters.push({
      x: position.x,
      y: position.y,
      hp: randInt(1, 5),
      hitChance = 0.3,
      seen: false,
      aggressive: false
    })
  }
}

var statsRenderer = new Renderer('stats', 0,
  mapWidth, canvasWidthChars - mapWidth, mapHeight)
var logRenderer = new Renderer('log', mapHeight, 0, canvasWidthChars, 5)

var colorRenderer = new Renderer('color', 0, 0, mapWidth, mapHeight)
var visibleRenderer = new Renderer('visible', 0, 0, mapWidth, mapHeight)
var levelRenderer = new Renderer('level', 0, 0, mapWidth, mapHeight)
var seenRenderer = new Renderer('seen', 0, 0, mapWidth, mapHeight)
var objectRenderer = new Renderer('objects', 0, 0, mapWidth, mapHeight)
var debugRenderer = new Renderer('debug', 0, 0, mapWidth, mapHeight)

function Game() {
  this.shouldRenderStats = true
  this.shouldRenderLog = true
  this.shouldRenderLevel = true
  this.shouldRenderObjects = true

  this.levels = []
  this.levels.push(new Level({ down: true }))
  this.currentLevel = 0

  this.updateState = function(event) { }
  this.render = function() {
    if (this.shouldRenderStats) {
      this.renderStats()
      this.shouldRenderStats = false
    }
    if (this.shouldRenderLog) {
      this.renderLog()
      this.shouldRenderLog = false
    }
    if (this.shouldRenderLevel) {
      this.renderLevel()
      this.shouldRenderLevel = false
    }
    if (this.shouldRenderObjects) {
      this.renderObjects()
      this.shouldRenderObjects = false
    }
  }

  this.renderStats = function() {
    statsRenderer.fillWithChar(' ')
  }

  this.renderLog = function() {
    logRenderer.fillWithChar(' ')
  }

  this.renderLevel = function() {
    levelRenderer.fillWithChar('.')
  }

  this.renderObjects = function() {
    objectRenderer.clear()
    objectRenderer.drawTile('green', 10, 10)
    objectRenderer.drawChar('@', 10, 10)
  }
}

function startGame() {
  var game = new Game();

  function gameLoop() {
    game.render()
    window.requestAnimationFrame(gameLoop)
  }

  window.addEventListener('keyup', function(e) {
    game.updateState(e)
  })

  window.requestAnimationFrame(gameLoop)
}
