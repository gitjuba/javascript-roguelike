var TileMap = require('../tilemap')

var { mapWidth, mapHeight } = require('../layout')

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
    var pt1 = this.tileMap.atDir(pt, dir)
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
