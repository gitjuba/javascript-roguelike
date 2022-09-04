var { mapWidth, mapHeight } = require('../layout')

function createEmptyTileMap(char = '#') {
  var tileMap = Array(mapHeight)
  for (var i = 0; i < mapHeight; i++) {
    tileMap[i] = Array(mapWidth)
    for (var j = 0; j < mapWidth; j++) {
      tileMap[i][j] = char
    }
  }
  return tileMap
}

function MapGenerator(level) {
  this.level = level

  this.mapWidth = mapWidth
  this.mapHeight = mapHeight
  this.mapArea = this.mapWidth * this.mapHeight

  this.tileMap = createEmptyTileMap()
  this.distToRooms = createEmptyTileMap(-1)
  this.roomIndex = createEmptyTileMap(-1)

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

  // for debugging
  this.print = function print() {
    for (var i = 0; i < this.tileMap.length; i++) {
      console.log(this.tileMap[i].join('') + ' ' + this.distToRooms[i].map(v => v < 0 ? '.' : v).join(''))
    }
  }
}

module.exports = MapGenerator
