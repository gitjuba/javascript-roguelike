var { mapWidth, mapHeight } = require('../layout')

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

function MapGenerator(level) {
  this.level = level

  this.mapWidth = mapWidth
  this.mapHeight = mapHeight
  this.mapArea = this.mapWidth * this.mapHeight

  this.tileMap = createEmptyTileMap()

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

  }

  this.placeUpStaircase = function placeUpStaircase() {

  }

  // for debugging
  this.print = function print() {
    console.log(this.tileMap.map(row => row.join('')).join('\n'))
  }
}

module.exports = MapGenerator
