var RandomRoomsMapGenerator = require('./mapgen/random-rooms-map-generator')
var BinarySpacePartitionMapGenerator = require('./mapgen/binary-space-partition-map-generator')
var RandomWalkMapGenerator = require('./mapgen/random-walk-map-generator')

var ErosionDungeonFeature = require('./mapgen/erosion-dungeon-feature')

var { mapWidth, mapHeight } = require('./layout')
var { rollMonster } = require('./monsters')
var { Monster } = require('./entities')
var { randInt } = require('./utils')

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

  var chooseMapGenerator = Math.random()
  if (chooseMapGenerator < 0.5) {
    var generator = new RandomRoomsMapGenerator(level)
  } else if (chooseMapGenerator < 0.75) {
    var generator = new BinarySpacePartitionMapGenerator(level)
  } else {
    var generator = new RandomWalkMapGenerator(level)
  }

  generator.generate()
  if (level > 0) {
    generator.placeUpStaircase()
  }
  generator.placeDownStaircase()

  this.map = generator.getFeatures()
  this.tileMap = generator.getTileMap()

  // Add a dungeon feature
  var addFeature = Math.random() < 1.0
  if (addFeature) {
    var chooseFeature = Math.random()
    if (chooseFeature < 1.0) {
      var feature = new ErosionDungeonFeature()
      feature.addToLevel(generator)
    }
  }

  this.colorMap = defaultTileColors

  this.seenMask = this.tileMap.map(row => row.map(() => false))
  this.isVisibleMask = this.tileMap.map(row => row.map(() => false))
  this.wasVisibleMask = this.tileMap.map(row => row.map(() => false))
  this.isOccupied = this.tileMap.map(row => row.map(tile => (tile == '#')))
  this.canMonsterSpawn = this.tileMap.map(row => row.map(tile => (tile == '.')))

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
            isVisible(j, i, player.x ,player.y, this.tileMap)) {
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
    return this.tileMap[position.y][position.x] == '>'
  }
  this.isUpStaircaseAt = function isUpStaircaseAt(position) {
    return this.tileMap[position.y][position.x] == '<'
  }
  this.getDownStaircasePosition = function getDownStaircasePosition() {
    if (this.hasDownStaircase()) {
      return this.map.down
    } else {
      throw new Error('No down staircase in level')
    }
  }
  this.getUpStaircasePosition = function getUpStaircasePosition() {
    if (this.hasUpStaircase()) {
      return this.map.up
    } else {
      throw new Error('No up staircase in level')
    }
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
