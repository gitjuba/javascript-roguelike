/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./charmap.js":
/*!********************!*\
  !*** ./charmap.js ***!
  \********************/
/***/ ((module) => {

var charWidthPixels = 9
var charHeightPixels = 14

// Map char to location (row, column) in image
var charOffsetX = 4
var charOffsetY = 4
var charMap = {
  ' ': { i: 0, j: 0 },
  '!': { i: 1, j: 1 },
  '"': { i: 1, j: 2 },
  '#': { i: 1, j: 3 }, // 2nd row, 4th column
  $: { i: 1, j: 4 },
  '%': { i: 1, j: 5 },
  '&': { i: 1, j: 6 },
  '(': { i: 1, j: 8 },
  ')': { i: 1, j: 9 },
  '*': { i: 1, j: 10 },
  '+': { i: 1, j: 11 },
  ',': { i: 1, j: 12 },
  '-': { i: 1, j: 13 },
  '.': { i: 1, j: 14 },
  '/': { i: 1, j: 15 },
  0: { i: 1, j: 16 },
  1: { i: 1, j: 17 },
  2: { i: 1, j: 18 },
  3: { i: 1, j: 19 },
  4: { i: 1, j: 20 },
  5: { i: 1, j: 21 },
  6: { i: 1, j: 22 },
  7: { i: 1, j: 23 },
  8: { i: 1, j: 24 },
  9: { i: 1, j: 25 },
  ':': { i: 1, j: 26 },
  ';': { i: 1, j: 27 },
  '<': { i: 1, j: 28 },
  '=': { i: 1, j: 29 },
  '>': { i: 1, j: 30 },
  '?': { i: 1, j: 31 },
  '@': { i: 2, j: 0 },
  A: { i: 2, j: 1 },
  B: { i: 2, j: 2 },
  C: { i: 2, j: 3 },
  D: { i: 2, j: 4 },
  E: { i: 2, j: 5 },
  F: { i: 2, j: 6 },
  G: { i: 2, j: 7 },
  H: { i: 2, j: 8 },
  I: { i: 2, j: 9 },
  J: { i: 2, j: 10 },
  K: { i: 2, j: 11 },
  L: { i: 2, j: 12 },
  M: { i: 2, j: 13 },
  N: { i: 2, j: 14 },
  O: { i: 2, j: 15 },
  P: { i: 2, j: 16 },
  Q: { i: 2, j: 17 },
  R: { i: 2, j: 18 },
  S: { i: 2, j: 19 },
  T: { i: 2, j: 20 },
  U: { i: 2, j: 21 },
  V: { i: 2, j: 22 },
  W: { i: 2, j: 23 },
  X: { i: 2, j: 24 },
  Y: { i: 2, j: 25 },
  Z: { i: 2, j: 26 },
  '_': { i: 2, j: 31 },
  a: { i: 3, j: 1 },
  b: { i: 3, j: 2 },
  c: { i: 3, j: 3 },
  d: { i: 3, j: 4 },
  e: { i: 3, j: 5 },
  f: { i: 3, j: 6 },
  g: { i: 3, j: 7 },
  h: { i: 3, j: 8 },
  i: { i: 3, j: 9 },
  j: { i: 3, j: 10 },
  k: { i: 3, j: 11 },
  l: { i: 3, j: 12 },
  m: { i: 3, j: 13 },
  n: { i: 3, j: 14 },
  o: { i: 3, j: 15 },
  p: { i: 3, j: 16 },
  q: { i: 3, j: 17 },
  r: { i: 3, j: 18 },
  s: { i: 3, j: 19 },
  t: { i: 3, j: 20 },
  u: { i: 3, j: 21 },
  v: { i: 3, j: 22 },
  w: { i: 3, j: 23 },
  x: { i: 3, j: 24 },
  y: { i: 3, j: 25 },
  z: { i: 3, j: 26 },
}

module.exports = {
  charWidthPixels,
  charHeightPixels,
  charOffsetX,
  charOffsetY,
  charMap
}


/***/ }),

/***/ "./entities.js":
/*!*********************!*\
  !*** ./entities.js ***!
  \*********************/
/***/ ((module) => {

// hash 3*dx + dy
// Is this necessary?
var displacementToDir = {
  '-4': 7,
  '-3': 6,
  '-2': 5,
  '-1': 0,
  '0': -1,
  '1': 4,
  '2': 1,
  '3': 2,
  '4': 3
}

function LivingEntity(char, color) {
  this.char = char
  this.color = color
  this.x = 0
  this.y = 0

  this.hp = 0
  this.hitChance = 0
  this.hitDamage = 0

  this.setPosition = function setPosition(position) {
    this.x = position.x
    this.y = position.y
  }

  this.isAdjacentTo = function isAdjacentTo(that) {
    return Math.max(Math.abs(this.x - that.x), Math.abs(this.y - that.y)) == 1
  }

  this.directionTo = function directionTo(that) {
    var dx = Math.sign(that.x - this.x)
    var dy = Math.sign(that.y - this.y)
    return displacementToDir[3 * dx + dy]
  }

  this.attack = function attack(that) {
    if (Math.random() < this.hitChance) {
      that.hp -= this.hitDamage
      return true
    } else {
      return false
    }
  }

  this.getApproachVectorsTo = function getApproachVectorsTo(that) {
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

  this.seen = false
  this.aggressive = false
  this.aggravationChance = 0.2
  this.pointValue = null

  this.rollAggravation = function rollAggravation() {
    if (this.seen && !this.aggressive && Math.random() < this.aggravationChance) {
      console.log('monster becomes agressive')
      this.aggressive = true
    }
  }
}
Monster.fromSpawner = function(spawner) {
  var monster = new Monster(spawner.char, spawner.color)
  monster.name = spawner.name
  monster.pointValue = spawner.pointValue
  monster.hp = spawner.hp()
  monster.hitChance = spawner.hitChance()
  monster.hitDamage = spawner.hitDamage()
  return monster
}

function Player(char, color, playerName) {
  LivingEntity.call(this, char, color)

  this.hp = 10
  this.hitChance = 0.5
  this.hitDamage = 2

  this.visRadius = 7.5
  this.attacking = false

  this.name = playerName
  this.score = 0

  this.route = []

  this.isWithinVisRadius = function isWithinVisRadius(i, j) {
    return (this.x - j) ** 2 + (this.y - i) ** 2 < this.visRadius ** 2
  }

  this.isEnRoute = function isEnRoute() {
    return this.route.length > 0
  }
}

module.exports = {
  Monster,
  Player
}


/***/ }),

/***/ "./layout.js":
/*!*******************!*\
  !*** ./layout.js ***!
  \*******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var { charWidthPixels, charHeightPixels } = __webpack_require__(/*! ./charmap */ "./charmap.js")

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


/***/ }),

/***/ "./level.js":
/*!******************!*\
  !*** ./level.js ***!
  \******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var RandomRoomsMapGenerator = __webpack_require__(/*! ./mapgen/random-rooms-map-generator */ "./mapgen/random-rooms-map-generator.js")
var BinarySpacePartitionMapGenerator = __webpack_require__(/*! ./mapgen/binary-space-partition-map-generator */ "./mapgen/binary-space-partition-map-generator.js")
var RandomWalkMapGenerator = __webpack_require__(/*! ./mapgen/random-walk-map-generator */ "./mapgen/random-walk-map-generator.js")

var ErosionDungeonFeature = __webpack_require__(/*! ./mapgen/erosion-dungeon-feature */ "./mapgen/erosion-dungeon-feature.js")
var ErodedRoomDungeonFeature = __webpack_require__(/*! ./mapgen/eroded-room-dungeon-feature */ "./mapgen/eroded-room-dungeon-feature.js")

var { mapWidth, mapHeight } = __webpack_require__(/*! ./layout */ "./layout.js")
var { rollMonster } = __webpack_require__(/*! ./monsters */ "./monsters.js")
var { Monster } = __webpack_require__(/*! ./entities */ "./entities.js")
var { randInt } = __webpack_require__(/*! ./utils */ "./utils.js")

var defaultTileColors = {
  '#': '#666',
  '.': '#ddd',
  '<': '#ddd',
  '>': '#ddd',
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

function Level(level) {
  this.level = level

  if (level > 0 && level % 5 == 0) {
    var generator = new RandomWalkMapGenerator(level)
  } else {
    var chooseMapGenerator = Math.random()
    if (chooseMapGenerator < 0.5) {
      var generator = new RandomRoomsMapGenerator(level)
    } else {
      var generator = new BinarySpacePartitionMapGenerator(level)
    }
  }

  generator.generate()
  if (level > 0) {
    generator.placeUpStaircase()
  }
  generator.placeDownStaircase()

  this.map = generator.getFeatures()
  this.tileMap = generator.getTileMap()

  // Add a dungeon feature
  if (level % 10 == 3) {
    var feature = new ErodedRoomDungeonFeature()
  } else if (level % 10 == 8) {
    var feature = new ErosionDungeonFeature()
  }
  if (feature) {
    feature.addToLevel(generator)
  }

  this.colorMap = defaultTileColors

  this.seenMask = this.tileMap.data.map(row => row.map(() => false))
  this.isVisibleMask = this.tileMap.data.map(row => row.map(() => false))
  this.wasVisibleMask = this.tileMap.data.map(row => row.map(() => false))
  this.isOccupied = this.tileMap.data.map(row => row.map(tile => (tile == '#')))
  this.canMonsterSpawn = this.tileMap.data.map(row => row.map(tile => (tile == '.')))

  this.getRandomUnoccupiedTile = function getRandomUnoccupiedTile() {
    var position
    do {
      position = { x: randInt(1, mapWidth - 2), y: randInt(1, mapHeight - 2) }
    } while (!this.canMonsterSpawn[position.y][position.x])
    return position
  }

  this.occupy = function occupy(position) {
    this.isOccupied[position.y][position.x] = true
  }

  this.unoccupy = function unoccupy(position) {
    this.isOccupied[position.y][position.x] = false
  }

  this.placePlayer = function placePlayer(player) {
    this.occupy(player)
    for (var i = 0; i < mapHeight; i++) {
      for (var j = 0; j < mapWidth; j++) {
        this.wasVisibleMask[i][j] = this.isVisibleMask[i][j]
        if (player.isWithinVisRadius(i, j) &&
          isVisible(j, i, player.x, player.y, this.tileMap.data)) {
          this.seenMask[i][j] = true
          this.isVisibleMask[i][j] = true
        } else {
          this.isVisibleMask[i][j] = false
        }
      }
    }
  }

  this.becameNotVisible = function becameNotVisible(i, j) {
    return this.wasVisibleMask[i][j] && !this.isVisibleMask[i][j]
  }

  this.hasDownStaircase = function hasDownStaircase() {
    return this.map.down
  }
  this.hasUpStaircase = function hasUpStaircase() {
    return this.map.up
  }
  this.isDownStaircaseAt = function isDownStaircaseAt(position) {
    return this.tileMap.at(position) == '>'
  }
  this.isUpStaircaseAt = function isUpStaircaseAt(position) {
    return this.tileMap.at(position) == '<'
  }
  this.getDownStaircasePosition = function getDownStaircasePosition() {
    return this.map.down
  }
  this.getUpStaircasePosition = function getUpStaircasePosition() {
    return this.map.up
  }

  this.monsters = []
  var numMonsters = 5 + this.level
  for (var iMonster = 0; iMonster < numMonsters; iMonster++) {
    var monsterType = rollMonster(this.level)
    var monster = Monster.fromSpawner(monsterType)
    var position = this.getRandomUnoccupiedTile()
    monster.setPosition(position)
    this.isOccupied[position.y][position.x] = true
    this.monsters.push(monster)
  }
  this.getMonsterAt = function getMonsterAt(x, y) {
    return this.monsters.find(m => m.x == x && m.y == y && m.hp > 0)
  }
}

module.exports = Level


/***/ }),

/***/ "./logger.js":
/*!*******************!*\
  !*** ./logger.js ***!
  \*******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var {
  logWidth,
  logHeight
} = __webpack_require__(/*! ./layout */ "./layout.js")

// "singleton"
function Logger() {
  if (Logger.instance) {
    throw new Error('Use Logger.getInstance')
  }
  Logger.instance = this
  this.logBuffer = []
  this.maxLineWidth = logWidth - 2 // '> ' prefix
  this.lineRegex = new RegExp(`(.{0,${this.maxLineWidth}}$|.{0,${this.maxLineWidth}}\\b)`, 'g')

  this.newLine = ''
  this.appendToLine = function appendToLine(msg) {
    if (this.newLine.length == 0) {
      this.newLine += msg
    } else {
      this.newLine += (' ' + msg)
    }
  }
  this.finishLine = function finishLine() {
    if (this.newLine.length > 0) {
      this.logBuffer.unshift(this.newLine)
    }
    this.newLine = ''
  }

  this.getLogLines = function* getLogLines() {
    var linesToDisplay = []
    var iLine = 0
    while (linesToDisplay.length < logHeight) {
      if (iLine < this.logBuffer.length) {
        var line = this.logBuffer[iLine]
        var split = line.match(this.lineRegex)
          .map(part => part.trim())
          .filter(part => part.length > 0)
        for (var iPart = split.length - 1; iPart > 0; iPart--) {
          var part = '  ' + split[iPart]
          linesToDisplay.push(part)
        }
        var firstPart = '> ' + split[0]
        linesToDisplay.push(firstPart)
      } else {
        linesToDisplay.push('  ')
      }
      iLine += 1
    }
    iLine = 0
    while (iLine < logHeight) {
      var line = linesToDisplay[iLine]
      yield line.padEnd(logWidth, ' ')
      iLine += 1
    }
  }

  this.clearBuffer = function clearBuffer() {
    this.logBuffer = []
  }
}
Logger.getInstance = function getInstance() {
  return Logger.instance || new Logger()
}

module.exports = Logger


/***/ }),

/***/ "./mapgen/abstract-dungeon-feature.js":
/*!********************************************!*\
  !*** ./mapgen/abstract-dungeon-feature.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var { mapWidth, mapHeight } = __webpack_require__(/*! ../layout */ "./layout.js")

function DungeonFeature() {
  this.isApplicableTo = function isApplicableTo(level) {
    throw new Error('Use one of the child classes')
  }

  this.addToLevel = function addToLevel(level) {
    throw new Error('Use one of the child classes')
  }
}

module.exports = DungeonFeature


/***/ }),

/***/ "./mapgen/abstract-map-generator.js":
/*!******************************************!*\
  !*** ./mapgen/abstract-map-generator.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var TileMap = __webpack_require__(/*! ../tilemap */ "./tilemap.js")

var { mapWidth, mapHeight } = __webpack_require__(/*! ../layout */ "./layout.js")

function MapGenerator(level) {
  this.level = level

  this.mapWidth = mapWidth
  this.mapHeight = mapHeight
  this.mapArea = this.mapWidth * this.mapHeight

  // this.tileMap = MapGenerator.createEmptyTileMap()
  this.tileMap = new TileMap(this.mapWidth, this.mapHeight)

  this.features = {}

  this.generate = function generate() {
    throw new Error('Use one of the child classes')
  }

  this.getTileMap = function getTileMap() {
    return this.tileMap
  }

  this.getFeatures = function getFeatures() {
    throw new Error('Use one of the child classes')
  }

  this.placeDownStaircase = function placeDownStaircase() {
    throw new Error('Use one of the child classes')
  }

  this.placeUpStaircase = function placeUpStaircase() {
    throw new Error('Use one of the child classes')
  }

  // general tilemap related functionality
  this.advanceTo = function advanceTo(pt, dir) {
    var pt1 = this.tileMap.toDir(pt, dir)
    if (this.tileMap.inBounds(pt1)) {
      return pt1
    } else {
      return null
    }
  }

  // for debugging
  this.print = function print() {
    this.tileMap.print()
  }
}

MapGenerator.createEmptyTileMap = function createEmptyTileMap(char = '#') {
  var tileMap = Array(mapHeight)
  for (var i = 0; i < mapHeight; i++) {
    tileMap[i] = Array(mapWidth)
    for (var j = 0; j < mapWidth; j++) {
      tileMap[i][j] = char
    }
  }
  return tileMap
}

module.exports = MapGenerator


/***/ }),

/***/ "./mapgen/binary-space-partition-map-generator.js":
/*!********************************************************!*\
  !*** ./mapgen/binary-space-partition-map-generator.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapGenerator = __webpack_require__(/*! ./abstract-map-generator */ "./mapgen/abstract-map-generator.js")
var { Room } = __webpack_require__(/*! ./mapgen-commons */ "./mapgen/mapgen-commons.js")
var { randFloat, randInt } = __webpack_require__(/*! ../utils */ "./utils.js")

const AXIS_HORIZONTAL = 1
const AXIS_VERTICAL = 2

var params = {
  minRoomWidth: 5,
  maxRoomWidth: 15,
  minRoomHeight: 3,
  maxRoomHeight: 7,

  maxNumberOfRooms: 10,
  targetMapFillRatio: 0.33,
  maxFailuresToAddRoom: 100,

  minSplitRatio: 0.2,
  maxSplitRatio: 0.8,

  partitionWidthThreshold: 19,
  partitionHeightThreshold: 14
}

function Node(top, left, width, height) {
  this.top = top
  this.left = left
  this.width = width
  this.height = height

  this.parent = null
  this.splitAxis = null // split axis of parent
  this.firstChild = null
  this.secondChild = null

  this.room = null

  this.isLeafNode = function isLeafNode() {
    return this.firstChild == null && this.secondChild == null
  }

  this.canContainRoom = function canContainRoom() {
    return this.width >= params.minRoomWidth + 2 && this.height >= params.minRoomHeight + 2
  }

  this.hasRoom = function hasRoom() {
    return this.room != null
  }

  this.clone = function clone() {
    return new Node(this.top, this.left, this.width, this.height)
  }

  this.splitAlongHorizontal = function splitAlongHorizontal(ratio) {
    var upperHeight = Math.floor(ratio * this.height)

    var upperPart = this.clone()
    upperPart.splitAxis = AXIS_HORIZONTAL
    upperPart.height = upperHeight
    this.firstChild = upperPart
    upperPart.parent = this

    var lowerPart = this.clone()
    lowerPart.splitAxis = AXIS_HORIZONTAL
    lowerPart.top = upperPart.top + upperHeight
    lowerPart.height = this.height - upperHeight
    this.secondChild = lowerPart
    lowerPart.parent = this

    return [upperPart, lowerPart]
  }

  this.splitAlongVertical = function splitAlongVertical(ratio) {
    var leftWidth = Math.floor(ratio * this.width)

    var leftPart = this.clone()
    leftPart.splitAxis = AXIS_VERTICAL
    leftPart.width = leftWidth
    this.firstChild = leftPart
    leftPart.parent = this

    var rightPart = this.clone()
    rightPart.splitAxis = AXIS_VERTICAL
    rightPart.left = leftPart.left + leftWidth
    rightPart.width = this.width - leftWidth
    this.secondChild = rightPart
    rightPart.parent = this

    return [leftPart, rightPart]
  }

  this.split = function split(ratio) {
    var splitAlongHorizontal
    if (this.width < params.partitionWidthThreshold) {
      splitAlongHorizontal = true
    } else if (this.height < params.partitionHeightThreshold) {
      splitAlongHorizontal = false
    } else {
      splitAlongHorizontal = Math.random() < this.height / (this.width + this.height)
    }

    if (splitAlongHorizontal) {
      return this.splitAlongHorizontal(ratio)
    } else {
      return this.splitAlongVertical(ratio)
    }
  }

  this.getDescendantRooms = function getDescendantRooms() {
    var rooms = []
    if (this.hasRoom()) {
      rooms.push(this.room)
    }
    if (!this.isLeafNode()) {
      rooms = rooms.concat(this.firstChild.getDescendantRooms())
      rooms = rooms.concat(this.secondChild.getDescendantRooms())
    }
    return rooms
  }
}

function BinarySpacePartitionMapGenerator(level) {
  MapGenerator.call(this, level)

  this.rooms = []
  this.corridors = []
  this.features = {}

  var self = this

  this.generate = function generate() {
    var nodes = [
      new Node(0, 0, this.mapWidth, this.mapHeight)
    ]
    function split(node) {
      if (node.width < params.partitionWidthThreshold && node.height < params.partitionHeightThreshold) {
        return
      } else {
        var splitRatio = randFloat(params.minSplitRatio, params.maxSplitRatio)
        var children = node.split(splitRatio)
        children.forEach(child => {
          nodes.push(child)
          split(child)
        })
      }
    }

    split(nodes[0])

    nodes.forEach(node => {
      if (node.isLeafNode() && node.canContainRoom()) {
        var roomWidth = randInt(params.minRoomWidth, node.width - 2)
        var roomHeight = randInt(params.minRoomHeight, node.height - 2)
        var roomLeft = randInt(node.left + 1, node.left + node.width - 1 - (roomWidth + 1))
        var roomTop = randInt(node.top + 1, node.top + node.height - 1 - (roomHeight + 1))

        node.room = new Room(roomTop, roomLeft, roomWidth, roomHeight)

        self.rooms.push(node.room)
        self.carveRoom(node.room)
      }
    })

    function connectDescendants(node) {
      if (node.isLeafNode()) {
        return
      }
      var firstRooms = node.firstChild.getDescendantRooms()
      var secondRooms = node.secondChild.getDescendantRooms()
      var minDistance = Infinity
      var firstRoom = null
      var secondRoom = null
      firstRooms.forEach(room1 => {
        secondRooms.forEach(room2 => {
          var distance = room1.distanceTo(room2)
          if (distance < minDistance) {
            firstRoom = room1
            secondRoom = room2
            minDistance = distance
          }
        })
      })
      if (firstRoom && secondRoom) {
        [firstLeg, secondLeg] = firstRoom.getCorridorTo(secondRoom)
        self.corridors.push(firstLeg)
        self.corridors.push(secondLeg)
        self.carveRoom(firstLeg)
        self.carveRoom(secondLeg)
      }
      connectDescendants(node.firstChild)
      connectDescendants(node.secondChild)
    }

    connectDescendants(nodes[0])
  }

  this.carveRoom = function carveRoom(room) {
    for (var i = room.top; i < room.top + room.height; i++) {
      for (var j = room.left; j < room.left + room.width; j++) {
        var pt = { x: j, y: i }
        this.tileMap.put(pt, '.')
      }
    }
  }

  this.getFeatures = function getFeatures() {
    return {
      rooms: this.rooms,
      corridors: this.corridors,
      up: this.features.up,
      down: this.features.down
    }
  }

  this.placeStaircase = function placeStaircase(direction) {
    var roomInd = randInt(0, this.rooms.length - 1)
    var position = this.rooms[roomInd].getRandomPosition()
    this.features[direction] = position
    this.tileMap.put(position, direction == 'up' ? '<' : '>')
  }

  this.placeDownStaircase = function placeDownStaircase() {
    this.placeStaircase('down')
  }

  this.placeUpStaircase = function placeUpStaircase() {
    this.placeStaircase('up')
  }
}

module.exports = BinarySpacePartitionMapGenerator


/***/ }),

/***/ "./mapgen/eroded-room-dungeon-feature.js":
/*!***********************************************!*\
  !*** ./mapgen/eroded-room-dungeon-feature.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DungeonFeature = __webpack_require__(/*! ./abstract-dungeon-feature */ "./mapgen/abstract-dungeon-feature.js")

var { randInt } = __webpack_require__(/*! ../utils */ "./utils.js")

var params = {
  minErodedTiles: 10,
  maxErodedTiles: 100
}

function ErodedRoomDungeonFeature() {
  DungeonFeature.call(this)

  this.addToLevel = function addToLevel(generator) {
    if (!generator.rooms || generator.rooms.length == 0) {
      console.log('not room-based dungoen')
      return
    }
    var roomInd = randInt(0, generator.rooms.length - 1)
    var room = generator.rooms[roomInd]
    var numErodedTiles = randInt(params.minErodedTiles, params.maxErodedTiles)
    for (var i = 0; i < numErodedTiles; i++) {
      var dir = randInt(0, 7)
      // rays along the diagonal can start from two possible edges
      var edge = dir % 2 == 0 ? dir / 2 : randInt((dir - 1) / 2, (dir - 1) / 2 + 1)
      edge = edge % 4
      var pt = room.getRandomEdgePosition(edge)
      do {
        pt = generator.advanceTo(pt, dir)
      } while (pt && (generator.tileMap.at(pt) == '.' || generator.tileMap.at(pt) == '<' || generator.tileMap.at(pt) == '>'))
      if (pt) {
        generator.tileMap.put(pt, '.')
      }
    }
  }
}

module.exports = ErodedRoomDungeonFeature


/***/ }),

/***/ "./mapgen/erosion-dungeon-feature.js":
/*!*******************************************!*\
  !*** ./mapgen/erosion-dungeon-feature.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DungeonFeature = __webpack_require__(/*! ./abstract-dungeon-feature */ "./mapgen/abstract-dungeon-feature.js")

var { randInt } = __webpack_require__(/*! ../utils */ "./utils.js")

var params = {
  minErodedTiles: 100,
  maxErodedTiles: 300
}

function ErosionDungeonFeature() {
  DungeonFeature.call(this)

  this.addToLevel = function addToLevel(generator) {
    var numErodedTiles = randInt(params.minErodedTiles, params.maxErodedTiles)
    for (var i = 0; i < numErodedTiles; i++) {
      do {
        var pt = { x: randInt(1, generator.mapWidth - 2), y: randInt(1, generator.mapHeight - 2) }
        var adjacent = [
          { x: pt.x - 1, y: pt.y },
          { x: pt.x, y: pt.y - 1 },
          { x: pt.x + 1, y: pt.y },
          { x: pt.x, y: pt.y + 1 }
        ]
      } while (generator.tileMap.at(pt) != '#' || adjacent.every(p => generator.tileMap.at(p) == '#'))
      generator.tileMap.put(pt, '.')
    }
  }
}

module.exports = ErosionDungeonFeature


/***/ }),

/***/ "./mapgen/mapgen-commons.js":
/*!**********************************!*\
  !*** ./mapgen/mapgen-commons.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var { randInt } = __webpack_require__(/*! ../utils */ "./utils.js")

function Room(top, left, width, height) {
  this.top = top
  this.left = left
  this.width = width
  this.height = height

  this.connected = false

  this.area = function area() {
    return this.width * this.height
  }

  this.getRandomPosition = function getRandomPosition() {
    return {
      x: randInt(this.left, this.left + this.width - 1),
      y: randInt(this.top, this.top + this.height - 1)
    }
  }

  this.getRandomEdgePosition = function getRandomEdgePosition(edge) {
    // edge: 0 north, 1 east, 2 south, 3 west
    var pt = { x: 0, y: 0 }
    if (edge == 0) {
      pt.x = this.left + randInt(0, this.width - 1)
      pt.y = this.top
    } else if (edge == 1) {
      pt.x = this.left + this.width - 1
      pt.y = this.top + randInt(0, this.height - 1)
    } else if (edge == 2) {
      pt.x = this.left + randInt(0, this.width - 1)
      pt.y = this.top + this.height - 1
    } else if (edge == 3) {
      pt.x = this.left
      pt.y = this.top + randInt(0, this.height - 1)
    }
    return pt
  }

  this.overlapsX = function overlapsX(that) {
    return (
      that.left - this.width <= this.left &&
      this.left <= that.left + that.width
    )
  }

  this.overlapsY = function overlapsY(that) {
    return (
      that.top - this.height <= this.top &&
      this.top <= that.top + that.height
    )
  }

  this.overlaps = function overlaps(that) {
    return this.overlapsX(that) && this.overlapsY(that)
  }

  this.xDistanceTo = function xDistanceTo(that) {
    if (!this.overlapsX(that)) {
      return Math.min(Math.abs(this.left + this.width - that.left), Math.abs(that.left + that.width - this.left))
    } else {
      return 0
    }
  }

  this.yDistanceTo = function yDistanceTo(that) {
    if (!this.overlapsY(that)) {
      return Math.min(Math.abs(this.top + this.height - that.top), Math.abs(that.top + that.height - this.top))
    } else {
      return 0
    }
  }

  this.distanceTo = function distanceTo(that) {
    return this.xDistanceTo(that) + this.yDistanceTo(that)
  }

  // Two-segment corridor
  this.getCorridorTo = function getCorridorTo(that) {
    var pSrc = this.getRandomPosition()
    var xSrc = pSrc.x
    var ySrc = pSrc.y
    var pDest = that.getRandomPosition()
    var xDest = pDest.x
    var yDest = pDest.y

    var verticalFirst = Math.random() < 0.5
    var xTurn, yTurn
    if (verticalFirst) {
      xTurn = xSrc
      yTurn = yDest
    } else {
      xTurn = xDest
      yTurn = ySrc
    }

    var firstLeg, secondLeg
    if (verticalFirst) {
      firstLeg = new Room(Math.min(ySrc, yDest), xSrc, 1, Math.abs(ySrc - yDest) + 1)
      secondLeg = new Room(yDest, Math.min(xSrc, xDest), Math.abs(xSrc - xDest) + 1, 1)
    } else {
      firstLeg = new Room(ySrc, Math.min(xSrc, xDest), Math.abs(xSrc - xDest) + 1, 1)
      secondLeg = new Room(Math.min(ySrc, yDest), xDest, 1, Math.abs(ySrc - yDest) + 1)
    }

    return [firstLeg, secondLeg]
  }
}

module.exports = {
  Room
}


/***/ }),

/***/ "./mapgen/random-rooms-map-generator.js":
/*!**********************************************!*\
  !*** ./mapgen/random-rooms-map-generator.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapGenerator = __webpack_require__(/*! ./abstract-map-generator */ "./mapgen/abstract-map-generator.js")
var { Room } = __webpack_require__(/*! ./mapgen-commons */ "./mapgen/mapgen-commons.js")

var { randInt } = __webpack_require__(/*! ../utils */ "./utils.js")

var params = {
  minRoomWidth: 5,
  maxRoomWidth: 15,
  minRoomHeight: 3,
  maxRoomHeight: 7,

  maxNumberOfRooms: 10,
  targetMapFillRatio: 0.33,
  maxFailuresToAddRoom: 100,

  erosionChance: 0.25,
  minErodedTiles: 100,
  maxErodedTiles: 300
}

function RandomRoomsMapGenerator(level) {
  MapGenerator.call(this, level)

  this.rooms = []
  this.corridors = []

  this.generate = function generate() {
    var addMoreRooms = true
    var failuresToAddRoom = 0
    var totalRoomArea = 0

    while (addMoreRooms) {
      var width = randInt(params.minRoomWidth, params.maxRoomWidth)
      var height = randInt(params.minRoomHeight, params.maxRoomHeight)

      var left = randInt(1, this.mapWidth - 1 - (width + 1))
      var top = randInt(1, this.mapHeight - 1 - (height + 1))

      var roomCandidate = new Room(top, left, width, height)

      var overlapsOtherRooms = false
      for (var iRoom = 0; iRoom < this.rooms.length; iRoom++) {
        var room = this.rooms[iRoom]
        if (room.overlaps(roomCandidate)) {
          overlapsOtherRooms = true
          break
        }
      }
      if (overlapsOtherRooms) {
        failuresToAddRoom += 1
        if (failuresToAddRoom > params.maxFailuresToAddRoom) {
          addMoreRooms = false
        }
        continue
      }

      this.rooms.push(roomCandidate)

      totalRoomArea += roomCandidate.area()
      if (totalRoomArea / this.mapArea > params.targetMapFillRatio || this.rooms.length > params.maxNumberOfRooms) {
        addMoreRooms = false
      }
    }

    this.placeRandomCorridors()

    this.updateTileMap()
  }

  this.isBrushing = function isBrushing(candidate) {
    function roomBrushesCorridor(room, corridor) {
      if (corridor.width > 1 && ((corridor.top == room.top - 1) || (corridor.top == room.top + room.height))) {
        return corridor.overlapsX(room) || (corridor.left == room.left + room.width) || (corridor.left + corridor.width == room.left)
      } else if (corridor.height > 1 && ((corridor.left == room.left - 1) || (corridor.left == room.left + room.width))) {
        return corridor.overlapsY(room) || (corridor.top == room.top + room.height) || (corridor.top + corridor.height == room.top)
      }
    }
    for (var room of this.rooms) {
      if (roomBrushesCorridor(room, candidate)) {
        return true
      }
    }
    for (var corridor of this.corridors) {
      if (corridor.width == candidate.width && (corridor.left == candidate.left - 1 || corridor.left == candidate.left + 1)) {
        return true
      }
      if (corridor.height == candidate.height && (corridor.top == candidate.top - 1 || corridor.top == candidate.top + 1)) {
        return true
      }
    }
    return false
  }

  this.placeRandomCorridors = function placeRandomCorridors() {
    var iSrc = -1
    var iDest
    do {
      iSrc++
      iDest = iSrc + 1
      iDest = iDest % this.rooms.length
      while (this.rooms[iDest].connected) {
        iDest++
        if (iDest >= this.rooms.length) {
          iDest = 0
        }
      }
      var srcRoom = this.rooms[iSrc]
      var destRoom = this.rooms[iDest]

      var corridorAttempt = 0
      var corridorFound = false
      var isBrushing = true
      while (isBrushing && corridorAttempt < 10) {
        var [firstLeg, secondLeg] = srcRoom.getCorridorTo(destRoom)
        isBrushing = this.isBrushing(firstLeg) || this.isBrushing(secondLeg)
        if (!isBrushing) {
          corridorFound = true
          break
        }
        corridorAttempt++
      }

      if (corridorFound) {
        this.corridors.push(firstLeg)
        this.corridors.push(secondLeg)

        srcRoom.connected = true
        destRoom.connected = true

        for (var iRoom = 0; iRoom < this.rooms.length; iRoom++) {
          var room = this.rooms[iRoom]
          if (room.connected) {
            continue
          }
          if (room.overlaps(firstLeg) || room.overlaps(secondLeg)) {
            room.connected = true
          }
        }
      }
    } while (this.rooms.some(room => !room.connected))
  }

  this.carveRoom = function carveRoom(room, char = '.') {
    for (var i = room.top; i < room.top + room.height; i++) {
      for (var j = room.left; j < room.left + room.width; j++) {
        var pt = { x: j, y: i }
        this.tileMap.put(pt, char)
      }
    }
  }

  this.updateTileMap = function updateTileMap() {
    this.rooms.forEach((room, ind) => {
      this.carveRoom(room, '.')
    })
    this.corridors.forEach((corridor) => {
      this.carveRoom(corridor)
    })
  }

  this.getFeatures = function getFeatures() {
    return {
      rooms: this.rooms,
      corridors: this.corridors,
      up: this.features.up,
      down: this.features.down
    }
  }

  this.placeStaircase = function placeStaircase(direction) {
    var roomInd = randInt(0, this.rooms.length - 1)
    var position = this.rooms[roomInd].getRandomPosition()
    this.features[direction] = position
    this.tileMap.put(position, direction == 'up' ? '<' : '>')
  }

  this.placeDownStaircase = function placeDownStaircase() {
    this.placeStaircase('down')
  }

  this.placeUpStaircase = function placeUpStaircase() {
    this.placeStaircase('up')
  }
}

module.exports = RandomRoomsMapGenerator


/***/ }),

/***/ "./mapgen/random-walk-map-generator.js":
/*!*********************************************!*\
  !*** ./mapgen/random-walk-map-generator.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapGenerator = __webpack_require__(/*! ./abstract-map-generator */ "./mapgen/abstract-map-generator.js")

var { randInt } = __webpack_require__(/*! ../utils */ "./utils.js")

var params = {
  targetMapFillRatio: 0.33,
  maxWalkLength: 10000
}

function RandomWalkMapGenerator(level) {
  MapGenerator.call(this, level)

  this.walkCoverage = MapGenerator.createEmptyTileMap(false);
  var coverageUnit = 1 / (this.mapWidth * this.mapHeight)

  this.generate = function generate() {
    var pt = { x: Math.round(this.mapWidth / 2), y: Math.round(this.mapHeight / 2) }
    this.walkCoverage[pt.y][pt.x] = true
    var coverageFraction = coverageUnit
    var horizontalProb = (this.mapWidth) / (this.mapWidth + this.mapHeight)
    console.log('horizontal prob', horizontalProb)
    function getRandomDirection() {
      var dirHorizontal = Math.random() < horizontalProb
      if (dirHorizontal) {
        var dir = randInt(0, 1) * 2 + 1 // 1 or 3
      } else {
        var dir = randInt(0, 1) * 2
      }
      return dir
    }
    var dir = getRandomDirection()
    var walkLength = 0
    while (coverageFraction < params.targetMapFillRatio && walkLength < params.maxWalkLength) {
      var didMove = false
      if (dir == 0) {
        if (pt.y > 1) {
          pt.y--
          didMove = true
        } else {
          dir = 2 // bounce off the edge
        }
      } else if (dir == 1) {
        if (pt.x < this.mapWidth - 2) {
          pt.x++
          didMove = true
        } else {
          dir = 3
        }
      } else if (dir == 2) {
        if (pt.y < this.mapHeight - 2) {
          pt.y++
          didMove = true
        } else {
          dir = 0
        }
      } else if (dir == 3) {
        if (pt.x > 1) {
          pt.x--
          didMove = true
        } else {
          dir = 1
        }
      }
      if (!this.walkCoverage[pt.y][pt.x]) {
        this.walkCoverage[pt.y][pt.x] = true
        coverageFraction += coverageUnit
      }
      this.tileMap.put(pt, '.')
      walkLength++

      if (didMove) { dir = getRandomDirection() }
    }
    console.log(`cov ${coverageFraction}, walk ${walkLength}`)
  }

  this.placeStaircase = function placeStaircase(direction) {
    do {
      var pt = { x: randInt(0, this.mapWidth - 1), y: randInt(0, this.mapHeight - 1) }
    } while (!this.walkCoverage[pt.y][pt.x])
    this.features[direction] = pt
    this.tileMap.put(pt, direction == 'up' ? '<' : '>')
  }

  this.placeDownStaircase = function placeDownStaircase() {
    this.placeStaircase('down')
  }

  this.placeUpStaircase = function placeUpStaircase() {
    this.placeStaircase('up')
  }

  this.getFeatures = function getFeatures() {
    return {
      up: this.features.up,
      down: this.features.down
    }
  }
}

module.exports = RandomWalkMapGenerator


/***/ }),

/***/ "./monsters.js":
/*!*********************!*\
  !*** ./monsters.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var { randInt } = __webpack_require__(/*! ./utils */ "./utils.js")

var monsterDictionary = [
  {
    name: 'small monster',
    char: 'g',
    color: '#f00',
    pointValue: level => level * 1 + 1,
    spawnWeight: level => 1 / (level + 1),
    hp: level => [1, 1],
    hitChance: level => [10, 20],
    hitDamage: level => [1, 1]
  },
  {
    name: 'monster',
    char: 'g',
    color: '#a00',
    pointValue: level => level * 2 + 2,
    spawnWeight: level => 1.0,
    hp: level => [1, 1 + Math.floor(level / 2)],
    hitChance: level => [10 + level, 20 + 2 * level],
    hitDamage: level => [1, 1 + Math.floor(level / 4)]
  },
  {
    name: 'large monster',
    char: 'G',
    color: '#a50',
    pointValue: level => level * 3 + 3,
    spawnWeight: level => level / 20,
    hp: level => [5, 5 + level],
    hitChance: level => [10 + level, 20 + 2 * level],
    hitDamage: level => [2, 2 + Math.floor(level / 2)]
  },
  {
    name: 'huge monster',
    char: 'G',
    color: '#840',
    pointValue: level => level * 4 + 4,
    spawnWeight: level => level / 500,
    hp: level => [10, 10 + level],
    hitChance: level => [20 + level, 30 + 2 * level],
    hitDamage: level => [4, 4 + level]
  }
]

function generateSpawnerFrom(entry, level) {
  var hpBounds = entry.hp(level)
  var hitChanceBounds = entry.hitChance(level)
  var hitDamageBounds = entry.hitDamage(level)
  var pointValue = entry.pointValue(level)
  return {
    name: entry.name,
    char: entry.char,
    color: entry.color,
    pointValue,
    hp: () => randInt(hpBounds[0], hpBounds[1]),
    hitChance: () => randInt(hitChanceBounds[0], hitChanceBounds[1]) / 100,
    hitDamage: () => randInt(hitDamageBounds[0], hitDamageBounds[1])
  }
}

function rollMonster(level) {
  var roll = Math.random()
  var weightSum = monsterDictionary.reduce((acc, curr) => acc + curr.spawnWeight(level), 0)
  var cumulativeWeight = 0
  for (var i = 0; i < monsterDictionary.length; i++) {
    var entry = monsterDictionary[i]
    cumulativeWeight += entry.spawnWeight(level) / weightSum
    if (roll < cumulativeWeight) {
      var spawner = generateSpawnerFrom(entry, level)
      return spawner
    }
  }
}

module.exports = {
  rollMonster,
}


/***/ }),

/***/ "./renderer.js":
/*!*********************!*\
  !*** ./renderer.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var {
  charOffsetX,
  charOffsetY,
  charWidthPixels,
  charHeightPixels,
  charMap
} = __webpack_require__(/*! ./charmap */ "./charmap.js")

var {
  canvasWidth,
  canvasHeight
} = __webpack_require__(/*! ./layout */ "./layout.js")

function Renderer(id, top, left, width, height) {
  this.id = id

  this.top = top
  this.left = left
  this.width = width
  this.height = height

  this.context = null

  this.init = function init(container, charSheet) {
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

  this.clear = function clear() {
    this.context.clearRect(0, 0, canvasWidth, canvasHeight)
  }

  this.drawChar = function drawChar(char, i, j) {
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

  this.drawText = function drawText(text, color, i, j) {
    // negative i means count lines from bottom
    for (var k = 0; k < text.length; k++) {
      this.drawColoredChar(text[k], color, i >= 0 ? i : this.height + i, j + k)
    }
  }

  this.drawTile = function drawTile(color, i, j) {
    this.context.fillStyle = color
    this.context.fillRect(
      (this.left + j) * charWidthPixels,
      (this.top + i) * charHeightPixels,
      charWidthPixels,
      charHeightPixels
    )
  }

  this.clearTile = function clearTile(i, j) {
    this.context.clearRect(
      (this.left + j) * charWidthPixels,
      (this.top + i) * charHeightPixels,
      charWidthPixels,
      charHeightPixels
    )
  }

  this.drawColoredChar = function drawColoredChar(char, color, i, j) {
    this.drawTile(color, i, j)
    this.drawChar(char, i, j)
  }

  this.fillWithChar = function fillWithChar(char) {
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        this.drawChar(char, i, j)
      }
    }
  }
}

module.exports = Renderer


/***/ }),

/***/ "./tilemap.js":
/*!********************!*\
  !*** ./tilemap.js ***!
  \********************/
/***/ ((module) => {

var allDirections = [0, 1, 2, 3, 4, 5, 6, 7]
var cardinalDirections = [0, 2, 4, 6]

function TileMap(mapWidth, mapHeight, char) {
  this.mapWidth = mapWidth
  this.mapHeight = mapHeight

  this.data = TileMap.create(this.mapWidth, this.mapHeight, char)

  this.at = function at(pt) {
    return this.data[pt.y][pt.x]
  }

  this.put = function put(pt, char) {
    this.data[pt.y][pt.x] = char
  }

  this.inBounds = function inBounds(pt) {
    return (pt.x > 0 && pt.x < this.mapWidth - 1 && pt.y > 0 && pt.y < this.mapHeight - 1)
  }

  // directions 0: north, 1: northeast, 2: east, ..., 7: northwest
  this.toDir = function toDir(pt, dir) {
    var pt1
    if (dir == 0) {
      pt1 = { x: pt.x, y: pt.y - 1 }
    } else if (dir == 1) {
      pt1 = { x: pt.x + 1, y: pt.y - 1 }
    } else if (dir == 2) {
      pt1 = { x: pt.x + 1, y: pt.y }
    } else if (dir == 3) {
      pt1 = { x: pt.x + 1, y: pt.y + 1 }
    } else if (dir == 4) {
      pt1 = { x: pt.x, y: pt.y + 1 }
    } else if (dir == 5) {
      pt1 = { x: pt.x - 1, y: pt.y + 1 }
    } else if (dir == 6) {
      pt1 = { x: pt.x - 1, y: pt.y }
    } else if (dir == 7) {
      pt1 = { x: pt.x - 1, y: pt.y - 1 }
    }
    return pt1
  }

  this.atDir = function atDir(pt, dir) {
    var pt1 = this.toDir(pt, dir)
    return this.at(pt1)
  }

  this.atDirs = function atDirs(pt, dirs) {
    return dirs.map(dir => this.atDir(pt, dir))
  }

  this.aroundDir = function aroundDir(pt, dir) {
    // what would be an efficient way to view environments?
    if (dir >= 0) {
      var dirs = [dir - 1, dir, dir + 1].map(d => {
        var dd = d % 8
        if (dd < 0) {
          dd += 8
        }
        return dd
      })
    } else {
      var dirs = [0, 1, 2, 3, 4, 5, 6, 7]
    }
    return this.atDirs(pt, dirs)
  }

  // for wayfinding
  this.accessibleEnvironment = function accessibleEnvironment(pt) {
    var points = allDirections.map(dir => this.toDir(pt, dir)).filter(this.inBounds.bind(this))
    var accessiblePoints = points.filter(p => ['.', '<', '>'].includes(this.at(p)))
    return accessiblePoints
  }

  this.print = function print() {
    for (var i = 0; i < this.mapHeight; i++) {
      console.log(this.data[i].join(''))
    }
  }

  this.copy = function copy() {
    var copy = new TileMap(this.mapWidth, this.mapHeight)
    for (var i = 0; i < this.mapHeight; i++) {
      for (var j = 0; j < this.mapWidth; j++) {
        var pt = { x: j, y: i }
        copy.put(pt, this.at(pt))
      }
    }
    return copy
  }
}

TileMap.create = function create(width, height, char = '#') {
  var arr = Array(height)
  for (var i = 0; i < height; i++) {
    arr[i] = Array(width)
    for (var j = 0; j < width; j++) {
      arr[i][j] = char
    }
  }
  return arr
}

TileMap.fromString = function fromString(str) {
  var rows = str.split('\n').filter(row => row.length > 0)
  if (rows.some(row => row.length != rows[0].length)) {
    throw new Error('Invalid tile map string')
  }
  var mapWidth = rows[0].length
  var mapHeight = rows.length
  var tileMap = new TileMap(mapWidth, mapHeight)
  for (var i = 0; i < mapHeight; i++) {
    for (var j = 0; j < mapWidth; j++) {
      var pt = { x: j, y: i }
      tileMap.put(pt, rows[i][j])
    }
  }
  return tileMap
}

module.exports = TileMap


/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/***/ ((module) => {

function randInt(n0, n1) {
  return n0 + Math.floor((n1 - n0 + 1) * Math.random())
}

function randFloat(f0, f1) {
  return f0 + Math.random() * (f1 - f0)
}

function tossACoin() {
  return Math.random() < 0.5
}

module.exports = {
  randInt,
  randFloat
}


/***/ }),

/***/ "./wayfinder.js":
/*!**********************!*\
  !*** ./wayfinder.js ***!
  \**********************/
/***/ ((module) => {

function Wayfinder() {
  this.getRouteBetween = function getRouteBetween(start, finish, tileMap) {
    // debugging
    var statusMap = tileMap.copy()
    statusMap.put(start, 's')
    // A* algorithm
    var openSet = [start]
    var gScore = {}
    var fScore = {}
    var cameFrom = {}
    var route = []
    function hScore(p) {
      return Math.max(Math.abs(p.x - finish.x), Math.abs(p.y - finish.y))
    }
    function hash(p) {
      return 100 * p.x + p.y
    }
    start.hash = hash(start)
    finish.hash = hash(finish)
    fScore[start.hash] = hScore(start)
    gScore[start.hash] = 0

    var maxIter = 1000
    var iIter = 0
    while (openSet.length > 0) {
      var minScore = Infinity
      var current
      var currentInd
      for (var i = 0; i < openSet.length; i++) {
        if (fScore[openSet[i].hash] < minScore) {
          minScore = fScore[openSet[i].hash]
          current = openSet[i]
          currentInd = i
        }
      }
      openSet.splice(currentInd, 1)
      statusMap.put(current, '-')

      if (current.hash == finish.hash) {
        console.log('wayfinding success')
        route = [current]
        while (current.hash in cameFrom) {
          current = cameFrom[current.hash]
          route.unshift(current)
        }
        break
      }
      var neighborhood = tileMap.accessibleEnvironment(current)
      for (var neighbor of neighborhood) {
        neighbor.hash = hash(neighbor)
        if (!(neighbor.hash in gScore) || (gScore[neighbor.hash] > gScore[current.hash] + 1)) {
          gScore[neighbor.hash] = gScore[current.hash] + 1
          fScore[neighbor.hash] = gScore[neighbor.hash] + hScore(neighbor)
          cameFrom[neighbor.hash] = current

          if (!openSet.find(p => p.hash == neighbor.hash)) {
            openSet.push(neighbor)
            statusMap.put(neighbor, 'o')
          }
        }
      }
      iIter++

      // statusMap.print()
      // console.log('\n')

      if (iIter > maxIter) {
        break
      }
    }
    for (node of route) {
      // console.log(node)
      statusMap.put(node, '@')
    }

    // statusMap.print()
    return route
  }
}

module.exports = Wayfinder


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.js ***!
  \******************/
var Logger = __webpack_require__(/*! ./logger */ "./logger.js")
var Renderer = __webpack_require__(/*! ./renderer */ "./renderer.js")
var Level = __webpack_require__(/*! ./level */ "./level.js")
var { Player } = __webpack_require__(/*! ./entities */ "./entities.js")
var Wayfinder = __webpack_require__(/*! ./wayfinder */ "./wayfinder.js")

var GAME_VERSION = '0.0.3'

var {
  canvasWidthChars,
  canvasHeightChars,
  mapWidth,
  mapHeight,
  statsWidth,
  statsHeight,
  logWidth,
  logHeight
} = __webpack_require__(/*! ./layout */ "./layout.js")

var defaultTextColor = '#aaa'

function createCanvasContainer() {
  var div = document.createElement('div')
  div.className = 'container'
  document.body.appendChild(div)
  return div
}

var container = createCanvasContainer()

function createCharacterSheet(imageFile) {
  var img = document.createElement('img')
  img.src = imageFile
  img.className = 'character-sheet'
  img.onload = function () {
    splashScreen()
  }
  document.body.appendChild(img)
  return img
}

var charSheet = createCharacterSheet('Codepage-850_alpha.png')

var splashRenderer = new Renderer('splash', 0, 0, canvasWidthChars, canvasHeightChars).init(container, charSheet)

var statsRenderer = new Renderer('stats', 0,
  mapWidth, statsWidth, statsHeight).init(container, charSheet)

var logRenderer = new Renderer('log', mapHeight, 0, logWidth, logHeight).init(container, charSheet)

var colorRenderer = new Renderer('color', 0, 0, mapWidth, mapHeight).init(container, charSheet)
var visibleRenderer = new Renderer('visible', 0, 0, mapWidth, mapHeight).init(container, charSheet)
var levelRenderer = new Renderer('level', 0, 0, mapWidth, mapHeight).init(container, charSheet)
var objectRenderer = new Renderer('objects', 0, 0, mapWidth, mapHeight).init(container, charSheet)
var seenRenderer = new Renderer('seen', 0, 0, mapWidth, mapHeight).init(container, charSheet)
var debugRenderer = new Renderer('debug', 0, 0, mapWidth, mapHeight).init(container, charSheet)

var hofRenderer = new Renderer('hof', 0, 0, canvasWidthChars, canvasHeightChars).init(container, charSheet)

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
var keyToDir = {
  u: 7,
  i: 0,
  o: 1,
  j: 6,
  k: NaN,
  l: 2,
  m: 5,
  ',': 4,
  '.': 3
}
var dirToKey = {
  0: 'i',
  1: 'o',
  2: 'l',
  3: '.',
  4: ',',
  5: 'm',
  6: 'j',
  7: 'u'
}

function Game(gameOptions) {
  this.resetRenderFlags = function resetRenderFlags() {
    this.shouldRenderStats = true
    this.shouldRenderLog = true
    this.shouldRenderLevel = true
    this.shouldRenderObjects = true
    this.shouldRenderSeen = true
    this.shouldRenderVisible = true
  }
  this.resetRenderFlags()

  this.isFinished = false
  this.levels = []
  this.currentLevel = 0

  this.addNewLevel = function addNewLevel() {
    var newLevel = new Level(this.levels.length, { down: true, up: this.levels.length > 0 })
    this.levels.push(newLevel)
    return newLevel
  }
  this.isFirstLevel = function isFirstLevel() {
    return this.currentLevel == 0
  }
  this.isLatestLevel = function isLatestLevel() {
    return this.currentLevel == this.levels.length - 1
  }

  var logger = Logger.getInstance()
  logger.appendToLine(`Welcome, ${gameOptions.playerName}!`)
  logger.finishLine()

  this.addNewLevel()

  seenRenderer.fillWithChar(' ')

  this.player = new Player('@', 'green', gameOptions.playerName)
  var playerPosition = this.levels[this.currentLevel].getRandomUnoccupiedTile()
  this.player.setPosition(playerPosition)
  this.levels[this.currentLevel].placePlayer(this.player)

  this.getStatsLines = function getStatsLines() {
    return [
      this.player.name,
      'D  ' + String(this.currentLevel).padStart(5, ' '),
      'HP ' + String(this.player.hp).padStart(5, ' '),
      '$  ' + String(this.player.score).padStart(5, ' ')
    ]
  }

  this.updatePlayerEnvironment = function updatePlayerEnvironment(dir) {
    this.playerEnvironment = this.levels[this.currentLevel].tileMap.aroundDir(this.player, dir).join('')
  }
  this.updatePlayerEnvironment(NaN)

  this.engageAutoPilot = function engageAutoPilot(key) {
    this.isOnAutoPilot = true
    if (this.player.route && this.player.route.length > 0) {
      this.getAutoPilotEvent = function getAutoPilotEvent() {
        if (this.player.route.length > 0) {
          var nextNode = this.player.route.shift()
          var nextDir = this.player.directionTo(nextNode)
          return { key: dirToKey[nextDir] }
        } else {
          return null
        }
      }
    } else {
      // auto-walk
      this.getAutoPilotEvent = function getAutoPilotEvent() {
        return { key }
      }
      this.autoPilotEvent = { key }
    }
    this.autoPilotEnvironment = this.playerEnvironment
  }

  this.disengageAutoPilot = function disengageAutoPilot() {
    this.isOnAutoPilot = false
    this.autoPilotEvent = undefined
    this.autoPilotEnvironment = undefined
    this.player.route = []
  }
  this.disengageAutoPilot()

  this.updateState = function updateState(event) {
    var dx, dy

    var key = event.key

    var level = this.levels[this.currentLevel]

    var playerTurnDone = false

    var logger = Logger.getInstance()
    this.shouldRenderLog = true

    if (this.player.hp <= 0) {
      this.shouldRenderLog = false
      return
    }

    if (movementKeys.includes(key)) {
      ({ dx, dy } = keyDisplacement[key])
      var dir = keyToDir[key]
      if (this.player.attacking) {
        var monster = level.getMonsterAt(this.player.x + dx, this.player.y + dy)
        if (monster) {
          var success = this.player.attack(monster)
          if (success) {
            logger.appendToLine(`You hit the ${monster.name}.`)
          } else {
            logger.appendToLine(`You miss the ${monster.name}.`)
          }
          if (monster.hp <= 0) {
            logger.appendToLine(`The ${monster.name} is killed.`)
            this.player.score += monster.pointValue
            this.shouldRenderStats = true
            level.unoccupy(monster)
          }
        }
        this.player.attacking = false
        this.shouldRenderObjects = true
        playerTurnDone = true
      } else if (this.player.startedAutoWalk) {
        console.log('auto-walk')
        this.updatePlayerEnvironment(dir)
        this.engageAutoPilot(key)
        this.player.startedAutoWalk = false
      } else {
        if (dx == 0 && dy == 0) {
          playerTurnDone = true
          this.disengageAutoPilot()
        } else if (!level.isOccupied[this.player.y + dy][this.player.x + dx]) {
          level.unoccupy(this.player)
          this.player.x += dx
          this.player.y += dy
          level.placePlayer(this.player)
          this.shouldRenderSeen = true
          this.shouldRenderVisible = true
          playerTurnDone = true
          this.updatePlayerEnvironment(dir)
          if (this.isOnAutoPilot) {
            // check if surroundings of player change
            // don't stop wayfinding on env change
            if (!this.player.isEnRoute() && this.playerEnvironment != this.autoPilotEnvironment) {
              this.disengageAutoPilot()
            }
          }
        } else {
          // Moving against occupied space, turn not done
          this.disengageAutoPilot()
        }
        this.shouldRenderObjects = true
      }
    } else {
      switch (key) {
        case 'a':
          this.player.attacking = true
          break
        case 'g':
          this.player.startedAutoWalk = true
          break
        case 's':
          if (level.isDownStaircaseAt(this.player)) {
            var newLevel
            if (this.isLatestLevel()) {
              newLevel = this.addNewLevel()
            } else {
              newLevel = this.levels[this.currentLevel + 1]
            }
            logger.appendToLine('You descend the staircase.')
            this.currentLevel += 1
            this.resetRenderFlags()
            this.player.setPosition(newLevel.getUpStaircasePosition())
            newLevel.placePlayer(this.player)
          } else if (level.isUpStaircaseAt(this.player)) {
            var newLevel = this.levels[this.currentLevel - 1]
            logger.appendToLine('You ascend the staircase.')
            this.currentLevel -= 1
            this.resetRenderFlags()
            this.player.setPosition(newLevel.getDownStaircasePosition())
            newLevel.placePlayer(this.player)
          }
          break
        case '>':
          console.log('move to down staircase')
          var down = level.getDownStaircasePosition()
          if (down && level.seenMask[down.y][down.x]) {
            // console.log('down staircase seen')
            var wayfinder = new Wayfinder()
            var route = wayfinder.getRouteBetween(this.player, down, level.tileMap)
            this.player.route = route
            this.engageAutoPilot()
            // console.log(route)
          }
          this.player.startedAutoWalk = false
          break
        case '<':
          console.log('move to up staircase')
          var up = level.getUpStaircasePosition()
          if (up && level.seenMask[up.y][up.x]) {
            // console.log('up staircase seen')
            var wayfinder = new Wayfinder()
            var route = wayfinder.getRouteBetween(this.player, up, level.tileMap)
            this.player.route = route
            this.engageAutoPilot()
            // console.log(route)
          }
          this.player.startedAutoWalk = false
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
          if (monster.seen) {
            this.disengageAutoPilot()
          }
          monster.rollAggravation()
          if (monster.aggressive && monster.seen) {
            if (monster.isAdjacentTo(this.player)) {
              dx = 0
              dy = 0
              var success = monster.attack(this.player)
              if (success) {
                logger.appendToLine(`The ${monster.name} hits you.`)
                this.shouldRenderStats = true
              } else {
                logger.appendToLine(`The ${monster.name} misses you.`)
              }
              if (this.player.hp <= 0) {
                this.player.killedBy = `a ${monster.name}`
                logger.appendToLine('You die. Press Enter to continue...')
                this.isFinished = true
                break
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
              ; ({ dx, dy } = keyDisplacement[dir])
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
    logger.finishLine()
  }

  this.render = function render() {
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

  this.renderStats = function renderStats() {
    statsRenderer.clear()
    var statsLines = this.getStatsLines()
    statsRenderer.drawText(''.padEnd(statsWidth, ' '), defaultTextColor, 0, 0)
    var iLine = 1
    for (var line of statsLines) {
      statsRenderer.drawText(line.padEnd(statsWidth, ' '), defaultTextColor, iLine, 0)
      iLine += 1
    }
    while (iLine < statsHeight) {
      statsRenderer.drawText(''.padEnd(statsWidth, ' '), defaultTextColor, iLine, 0)
      iLine += 1
    }
  }

  this.renderLog = function renderLog() {
    logRenderer.clear()
    var logger = Logger.getInstance()
    var logLines = logger.getLogLines()
    var iLine = 1
    for (var line of logLines) {
      logRenderer.drawText(line, defaultTextColor, -iLine, 0)
      iLine += 1
    }
  }

  this.renderLevel = function renderLevel() {
    levelRenderer.clear()
    var level = this.levels[this.currentLevel]
    for (var i = 0; i < mapHeight; i++) {
      for (var j = 0; j < mapWidth; j++) {
        var tile = level.tileMap.data[i][j]
        colorRenderer.drawTile(level.colorMap[tile], i, j)
        levelRenderer.drawChar(tile, i, j)
      }
    }
  }

  this.renderObjects = function renderObjects() {
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

  this.renderSeen = function renderSeen() {
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

  this.renderVisible = function renderVisible() {
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

  this.clear = function clear() {
    var logger = Logger.getInstance()
    logger.clearBuffer()

    statsRenderer.clear()
    logRenderer.clear()
    colorRenderer.clear()
    visibleRenderer.clear()
    levelRenderer.clear()
    objectRenderer.clear()
    seenRenderer.clear()
    debugRenderer.clear()
  }
}

var alphabet = 'abcdefghijklmnopqrstuvxyz'

function splashScreen() {
  var shouldRenderSplash = true
  var shouldRenderPlayerName = true
  var playerName = ''

  var splashAnimationHandle

  function renderSplashScreen() {
    if (shouldRenderSplash) {
      splashRenderer.fillWithChar(' ')
      splashRenderer.drawText('a roguelike game', defaultTextColor, 10, 5)
      splashRenderer.drawText('please enter your name: ', defaultTextColor, 12, 5)
      splashRenderer.drawText('uiojklm,.  to move', defaultTextColor, 14, 5)
      splashRenderer.drawText('a + move   to attack', defaultTextColor, 15, 5)
      splashRenderer.drawText('g + move   to walk', defaultTextColor, 16, 5)
      splashRenderer.drawText('g + < or > to walk to stairs', defaultTextColor, 17, 5)
      splashRenderer.drawText('s          to ascend/descend stairs', defaultTextColor, 18, 5)
      shouldRenderSplash = false
    }

    if (shouldRenderPlayerName) {
      splashRenderer.drawText(`${playerName}_`.padEnd(16, ' '), defaultTextColor, 12, 29)
      shouldRenderPlayerName = false
    }

    splashAnimationHandle = window.requestAnimationFrame(renderSplashScreen)
  }

  function handleNameInput(e) {
    if (alphabet.includes(e.key) && playerName.length < 15) {
      playerName += e.key
      shouldRenderPlayerName = true
    }
    if (e.key == 'Backspace') {
      playerName = playerName.slice(0, playerName.length - 1)
      shouldRenderPlayerName = true
    }
  }

  function handleSubmitName(e) {
    if (e.key == 'Enter' && playerName.length > 0) {
      window.removeEventListener('keydown', handleNameInput)
      window.removeEventListener('keyup', handleSubmitName)
      window.cancelAnimationFrame(splashAnimationHandle)
      splashRenderer.clear()
      startGame({
        playerName
      })
    }
  }

  window.addEventListener('keydown', handleNameInput)
  window.addEventListener('keyup', handleSubmitName)

  splashAnimationHandle = window.requestAnimationFrame(renderSplashScreen)
}

function startGame(gameOptions) {
  var gameAnimationHandle

  var game = new Game(gameOptions)

  function gameLoop() {
    if (game.isOnAutoPilot) {
      var nextEvent = game.getAutoPilotEvent()
      if (nextEvent) {
        game.updateState(nextEvent)
      } else {
        game.disengageAutoPilot()
      }
      if (!game.isOnAutoPilot) {
        window.addEventListener('keyup', handleGameInput)
      }
    }
    game.render()
    gameAnimationHandle = window.requestAnimationFrame(gameLoop)
  }

  function handleGameInput(e) {
    game.updateState(e)
    if (game.isOnAutoPilot) {
      window.removeEventListener('keyup', handleGameInput)
    }
    if (e.key == 'Enter' && game.isFinished) {
      window.removeEventListener('keyup', handleGameInput)
      game.clear()
      window.cancelAnimationFrame(gameAnimationHandle)

      hallOfFame({
        newEntry: {
          player: game.player.name,
          score: game.player.score,
          version: GAME_VERSION,
          date: new Date().toISOString().slice(0, 10),
          dungeonLevel: game.currentLevel,
          causeOfDeath: game.player.killedBy,
          isNewEntry: true
        }
      })
    }
  }

  window.addEventListener('keyup', handleGameInput)

  gameAnimationHandle = window.requestAnimationFrame(gameLoop)
}

function hallOfFame(hofOptions) {
  var shouldRenderHof = true
  var hofAnimationHandle

  var numHofEntries = 8
  var onlineRanking = -1
  var onlineHof = []

  var hofUrl = 'https://roguelike.wildfirecanvas.com/roguelike/hof'
  fetch(hofUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hofOptions.newEntry)
  }).then(res => res.json()).then(res => {
    onlineHof = res.hof
    onlineRanking = res.ranking
    shouldRenderHof = true
  }).catch(err => {
    console.log('error posting to HOF')
    console.error(err)
  })

  function renderHof() {
    if (shouldRenderHof) {
      hofRenderer.fillWithChar(' ')
      hofRenderer.drawText(`roguelike game version ${GAME_VERSION} high scores`, defaultTextColor, 1, 1)

      onlineHof
        .slice(0, numHofEntries)
        .forEach((entry, ind) => {
          hofRenderer.drawText(
            `${String(ind + 1).padStart(3, ' ')} ${entry.Player.padEnd(15, ' ')} ${String(entry.Score).padStart(5, ' ')} ${entry.Version}`,
            entry.isNewEntry ? '#bb5' : defaultTextColor,
            2 * ind + 4,
            1
          )
          hofRenderer.drawText(
            `killed by ${entry.CauseOfDeath} on level ${entry.DungeonLevel} on ${entry.Date}`,
            entry.isNewEntry ? '#773' : '#666',
            2 * ind + 5,
            5
          )
        })

      var congratsText = ''
      if (onlineRanking > -1 && onlineRanking <= numHofEntries) {
        congratsText += 'congrats on making it to the top ' + numHofEntries
      } else {
        congratsText += `your online ranking with score ${hofOptions.newEntry.score} is ${onlineRanking}`
      }
      hofRenderer.drawText(congratsText, defaultTextColor, 22, 1)
      hofRenderer.drawText('press enter to start a new game', defaultTextColor, 23, 1)

      shouldRenderHof = false
    }

    hofAnimationHandle = window.requestAnimationFrame(renderHof)
  }

  function handleEnterKey(e) {
    if (e.key == 'Enter') {
      window.cancelAnimationFrame(hofAnimationHandle)
      window.removeEventListener('keyup', handleEnterKey)
      hofRenderer.clear()
      splashScreen()
    }
  }

  window.addEventListener('keyup', handleEnterKey)

  hofAnimationHandle = window.requestAnimationFrame(renderHof)
}

})();

/******/ })()
;
//# sourceMappingURL=main.js.map