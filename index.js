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

var defaultTileColors = {
  '#': '#666',
  '.': '#ddd',
  '<': '#ddd',
  '>': '#ddd',
}

function carveRoom(room, level) {
  for (var i = room.y; i < room.y + room.h; i++) {
    for (var j = room.x; j < room.x + room.w; j++) {
      level[i][j] = '.'
    }
  }
}

function LivingEntity(char, color) {
  this.char = char
  this.color = color
  this.x = 0
  this.y = 0

  this.setPosition = function(position) {
    this.x = position.x
    this.y = position.y
  }

  this.isAdjacentTo = function(that) {
    return Math.max(Math.abs(this.x - that.x), Math.abs(this.y - that.y)) == 1
  }

  this.attack = function(that) {
    if (Math.random() < this.hitChance) {
      that.hp -= 1
      return true
    } else {
      return false
    }
  }

  this.getApproachVectorsTo = function(that) {
    var dispX = that.x - this.x
    var dispY = that.y - this.y
    var dx0 = dispX != 0 ? (dispX < 0 ? -1 : 1) : 0
    var dy0 = dispY != 0 ? (dispY < 0 ? -1 : 1) : 0

    var vectors = [{ dx: dx0, dy: dy0 }]

    // If preferred direction along cardinal axis try also both diagonals around it
    if (dx0 == 0) {
      vectors.push({ dx: -1, dy: dy0 })
      vectors.push({ dx: 1, dy: dy0 })
    } else if (dy0 == 0) {
      vectors.push({ dx: dx0, dy: -1 })
      vectors.push({ dx: dx0, dy: 1 })
    } else {
      // Preferred direction is diagonal: try also both cardinal directions around it
      vectors.push({ dx: 0, dy: dy0 })
      vectors.push({ dx: dx0, dy: 0 })
    }

    return vectors
  }
}

function Monster(char, color) {
  LivingEntity.call(this, char, color)

  this.hp = randInt(1, 5)
  this.hitChance = 0.3

  this.seen = false
  this.aggressive = false
  this.aggravationChance = 0.2

  this.rollAggravation = function() {
    if (this.seen && !this.aggressive && Math.random() < this.aggravationChance) {
      console.log('monster becomes agressive')
      this.aggressive = true
    }
  }
}

function Player(char, color) {
  LivingEntity.call(this, char, color)

  this.hp = 10
  this.hitChance = 0.5

  this.visRadius = 7.5
  this.attacking = false

  this.isWithinVisRadius = function(i, j) {
    return (this.x - j) ** 2 + (this.y - i) ** 2 < this.visRadius ** 2
  }
}

var visBlock = {
  '#': 0.05,
  '.': 0.45,
  '<': 0.45,
  '>': 0.45,
}

// Is (x,y) visible from (x0,y0) in tile map level
function isVisible(x, y, x0, y0, level) {
  var m, xj, yj, yj_, xj_, j, dj, vbj_d, vbj_u, vb_d, vb_u
  if (Math.abs(y - y0) <= Math.abs(x - x0)) {
    // "x-simple"
    m = (y - y0) / (x - x0)
    dj = x < x0 ? -1 : 1
    vb_d = 0
    vb_u = 0
    for (j = 0; Math.abs(j) < Math.abs(x - x0); j += dj) {
      xj = x0 + j
      yj = y0 + m * j

      yj_ = Math.floor(yj)

      // Calculate blocked portion of visiblity to both sides
      vbj_d = 1 - (yj - yj_)
      vbj_u = 1 - vbj_d

      if (level[yj_][xj] == '#' && vbj_d > vb_d) {
        vb_d = vbj_d
      }
      if (level[yj_ + 1][xj] == '#' && vbj_u > vb_u) {
        vb_u = vbj_u
      }
      if (vb_d + vb_u > 1 - visBlock[level[y][x]]) {
        return false
      }
    }
  } else {
    // "y-simple"
    m = (x - x0) / (y - y0)
    dj = y < y0 ? -1 : 1
    vb_d = 0
    vb_u = 0
    for (j = 0; Math.abs(j) < Math.abs(y - y0); j += dj) {
      yj = y0 + j
      xj = x0 + m * j

      xj_ = Math.floor(xj)

      vbj_d = 1 - (xj - xj_)
      vbj_u = 1 - vbj_d

      if (level[yj][xj_] == '#' && vbj_d > vb_d) {
        vb_d = vbj_d
      }
      if (level[yj][xj_ + 1] == '#' && vbj_u > vb_u) {
        vb_u = vbj_u
      }
      if (vb_d + vb_u > 1 - visBlock[level[y][x]]) {
        return false
      }
    }
  }
  return true
}

function Level(params) {
  this.map = generateLevel(mapWidth, mapHeight, params)
  this.tileMap = createEmptyTileMap()
  this.map.rooms.forEach(room => {
    carveRoom(room, this.tileMap)
  })
  this.map.corridors.forEach(room => {
    carveRoom(room, this.tileMap)
  })
  if (this.map.up) {
    this.tileMap[this.map.up.y][this.map.up.x] = '<'
  }
  if (this.map.down) {
    this.tileMap[this.map.down.y][this.map.down.x] = '>'
  }

  this.colorMap = defaultTileColors

  this.seenMask = this.tileMap.map(row => row.map(() => false))
  this.isVisibleMask = this.tileMap.map(row => row.map(() => false))
  this.wasVisibleMask = this.tileMap.map(row => row.map(() => false))
  this.isOccupied = this.tileMap.map(row => row.map(tile => (tile == '#')))

  this.getRandomUnoccupiedTile = function() {
    var position
    do {
      position = getRandomRoomPosition(this.map)
    } while (this.isOccupied[position.y][position.x])
    return position
  }

  this.occupy = function(position) {
    this.isOccupied[position.y][position.x] = true
  }

  this.unoccupy = function(position) {
    this.isOccupied[position.y][position.x] = false
  }

  this.placePlayer = function(player) {
    this.occupy(player)
    for (var i = 0; i < mapHeight; i++) {
      for (var j = 0; j < mapWidth; j++) {
        this.wasVisibleMask[i][j] = this.isVisibleMask[i][j]
        if (player.isWithinVisRadius(i, j) &&
            isVisible(j, i, player.x ,player.y, this.tileMap)) {
          this.seenMask[i][j] = true
          this.isVisibleMask[i][j] = true
        } else {
          this.isVisibleMask[i][j] = false
        }
      }
    }
  }

  this.becameNotVisible = function(i, j) {
    return this.wasVisibleMask[i][j] && !this.isVisibleMask[i][j]
  }

  this.hasDownStaircase = function() {
    return this.map.down
  }
  this.hasUpStaircase = function() {
    return this.map.up
  }
  this.isDownStaircaseAt = function(position) {
    return this.tileMap[position.y][position.x] == '>'
  }
  this.isUpStaircaseAt = function(position) {
    return this.tileMap[position.y][position.x] == '<'
  }
  this.getDownStaircasePosition = function() {
    if (this.hasDownStaircase()) {
      return this.map.down
    } else {
      throw new Error('No down staircase in level')
    }
  }
  this.getUpStaircasePosition = function() {
    if (this.hasUpStaircase()) {
      return this.map.up
    } else {
      throw new Error('No up staircase in level')
    }
  }

  this.monsters = []
  for (var iMonster = 0; iMonster < 5; iMonster++) {
    var monster = new Monster('g', 'red')
    var position = this.getRandomUnoccupiedTile()
    monster.setPosition(position)
    this.isOccupied[position.y][position.x] = true
    this.monsters.push(monster)
  }
  this.getMonsterAt = function(x, y) {
    return this.monsters.find(m => m.x == x && m.y == y && m.hp > 0)
  }
}

var statsRenderer = new Renderer('stats', 0,
  mapWidth, canvasWidthChars - mapWidth, mapHeight)
var logRenderer = new Renderer('log', mapHeight, 0, canvasWidthChars, 5)

var colorRenderer = new Renderer('color', 0, 0, mapWidth, mapHeight)
var visibleRenderer = new Renderer('visible', 0, 0, mapWidth, mapHeight)
var levelRenderer = new Renderer('level', 0, 0, mapWidth, mapHeight)
var objectRenderer = new Renderer('objects', 0, 0, mapWidth, mapHeight)
var seenRenderer = new Renderer('seen', 0, 0, mapWidth, mapHeight)
var debugRenderer = new Renderer('debug', 0, 0, mapWidth, mapHeight)

var movementKeys = 'uiojklm,.'
var keyDisplacement = {
  u: { dx: -1, dy: -1 },
  i: { dx: 0, dy: -1 },
  o: { dx: 1, dy: -1 },
  j: { dx: -1, dy: 0 },
  k: { dx: 0, dy: 0 },
  l: { dx: 1, dy: 0 },
  m: { dx: -1, dy: 1 },
  ',': { dx: 0, dy: 1 },
  '.': { dx: 1, dy: 1 }
}

function Game() {
  this.resetRenderFlags = function() {
    this.shouldRenderStats = true
    this.shouldRenderLog = true
    this.shouldRenderLevel = true
    this.shouldRenderObjects = true
    this.shouldRenderSeen = true
    this.shouldRenderVisible = true
  }
  this.resetRenderFlags()

  this.levels = []
  this.currentLevel = 0

  this.addNewLevel = function() {
    var newLevel = new Level({ down: true, up: this.levels.length > 0 })
    this.levels.push(newLevel)
    return newLevel
  }
  this.isFirstLevel = function() {
    return this.currentLevel == 0
  }
  this.isLatestLevel = function() {
    return this.currentLevel == this.levels.length - 1
  }

  this.addNewLevel()

  seenRenderer.fillWithChar(' ')

  this.player = new Player('@', 'green')
  var playerPosition = this.levels[this.currentLevel].getRandomUnoccupiedTile()
  this.player.setPosition(playerPosition)
  this.levels[this.currentLevel].placePlayer(this.player)

  this.updateState = function(event) {
    var dx, dy

    var key = event.key

    var level = this.levels[this.currentLevel]

    var playerTurnDone = false

    if (this.player.hp <= 0) {
      console.log('you are dead')
      return
    }

    if (movementKeys.includes(key)) {
      ({ dx, dy } = keyDisplacement[key])
      if (this.player.attacking) {
        var monster = level.getMonsterAt(this.player.x + dx, this.player.y + dy)
        if (monster) {
          var success = this.player.attack(monster)
          if (monster.hp == 0) {
            level.unoccupy(monster)
          }
        }
        this.player.attacking = false
        this.shouldRenderObjects = true
        playerTurnDone = true
      } else {
        if (dx == 0 && dy == 0) {
          playerTurnDone = true
        } else if (!level.isOccupied[this.player.y + dy][this.player.x + dx]) {
          level.unoccupy(this.player)
          this.player.x += dx
          this.player.y += dy
          level.placePlayer(this.player)
          this.shouldRenderSeen = true
          this.shouldRenderVisible = true
          playerTurnDone = true
        } else {
          // Moving against occupied space, turn not done
        }
        this.shouldRenderObjects = true
      }
    } else {
      switch (key) {
        case 'a':
          console.log('attack')
          this.player.attacking = true
          break
        case 's':
          console.log('use stairs')
          if (level.isDownStaircaseAt(this.player)) {
            var newLevel
            if (this.isLatestLevel()) {
              newLevel = this.addNewLevel()
            } else {
              newLevel = this.levels[this.currentLevel + 1]
            }
            this.currentLevel += 1
            this.resetRenderFlags()
            this.player.setPosition(newLevel.getUpStaircasePosition())
            newLevel.placePlayer(this.player)
          } else if (level.isUpStaircaseAt(this.player)) {
            var newLevel = this.levels[this.currentLevel - 1]
            this.currentLevel -= 1
            this.resetRenderFlags()
            this.player.setPosition(newLevel.getDownStaircasePosition())
            newLevel.placePlayer(this.player)
          }
          break
        default:
          console.log('unknown command: ' + key)
      }
    }

    if (playerTurnDone) {
      for (var iMonster = 0; iMonster < level.monsters.length; iMonster++) {
        var monster = level.monsters[iMonster]
        if (monster.hp > 0) {
          if (!monster.seen && level.isVisibleMask[monster.y][monster.x]) {
            monster.seen = true
          } else if (monster.seen && !level.isVisibleMask[monster.y][monster.x]) {
            monster.seen = false
          }
          monster.rollAggravation()
          if (monster.aggressive && monster.seen) {
            if (monster.isAdjacentTo(this.player)) {
              dx = 0
              dy = 0
              var success = monster.attack(this.player)
              if (this.player.hp <= 0) {
                console.log('you die')
              }
            } else {
              var vectors = monster.getApproachVectorsTo(this.player)
              var vectorFound = false
              for (var v of vectors) {
                if (!level.isOccupied[monster.y + v.dy][monster.x + v.dx]) {
                  dx = v.dx
                  dy = v.dy
                  vectorFound = true
                  break
                }
              }
              if (!vectorFound) {
                dx = 0
                dy = 0
              }
            }
          } else {
            var dirInd = Math.floor(9 * Math.random())
            var dir = movementKeys[dirInd]
            ;({ dx, dy } = keyDisplacement[dir])
            if (level.isOccupied[monster.y + dy][monster.x + dx]) {
              dx = 0
              dy = 0
            }
          }
          level.unoccupy(monster)
          monster.x += dx
          monster.y += dy
          level.occupy(monster)
        }
      }
    }
  }

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
    if (this.shouldRenderSeen) {
      this.renderSeen()
      this.shouldRenderSeen = false
    }
    if (this.shouldRenderVisible) {
      this.renderVisible()
      this.shouldRenderVisible = false
    }
  }

  this.renderStats = function() {
    statsRenderer.fillWithChar(' ')
  }

  this.renderLog = function() {
    logRenderer.fillWithChar(' ')
  }

  this.renderLevel = function() {
    levelRenderer.clear()
    var level = this.levels[this.currentLevel]
    for (var i = 0; i < mapHeight; i++) {
      for (var j = 0; j < mapWidth; j++) {
        var tile = level.tileMap[i][j]
        colorRenderer.drawTile(level.colorMap[tile], i, j)
        levelRenderer.drawChar(tile, i, j)
      }
    }
  }

  this.renderObjects = function() {
    objectRenderer.clear()
    objectRenderer.drawColoredChar(this.player.char, this.player.color, this.player.y, this.player.x)

    var level = this.levels[this.currentLevel]
    for (var iMonster = 0; iMonster < level.monsters.length; iMonster++) {
      var monster = level.monsters[iMonster]
      if (monster.hp > 0 && level.isVisibleMask[monster.y][monster.x]) {
        objectRenderer.drawColoredChar(monster.char, monster.color, monster.y, monster.x)
      }
    }
  }

  this.renderSeen = function() {
    var level = this.levels[this.currentLevel]
    for (var i = 0; i < mapHeight; i++) {
      for (var j = 0; j < mapWidth; j++) {
        if (level.seenMask[i][j]) {
          seenRenderer.clearTile(i, j)
        } else {
          seenRenderer.drawChar(' ', i, j)
        }
      }
    }
  }

  this.renderVisible = function() {
    var level = this.levels[this.currentLevel]
    for (var i = 0; i < mapHeight; i++) {
      for (var j = 0; j < mapWidth; j++) {
        if (level.isVisibleMask[i][j]) {
          visibleRenderer.clearTile(i, j)
        } else if (level.becameNotVisible(i, j)) {
          visibleRenderer.drawTile('rgba(0, 0, 0, 0.2)', i, j)
        }
      }
    }
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
