var { mapWidth, mapHeight } = require('../layout')

function MapGenerator(level) {
  this.level = level

  this.mapWidth = mapWidth
  this.mapHeight = mapHeight
  this.mapArea = this.mapWidth * this.mapHeight

  this.tileMap = MapGenerator.createEmptyTileMap()

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
    if (dir == 0) {
      if (pt.y < 2) { return null }
      pt.y--
    } else if (dir == 1) {
      if (pt.x > this.mapWidth - 3 || pt.y < 2) { return null }
      pt.x++
      pt.y--
    } else if (dir == 2) {
      if (pt.x > this.mapWidth - 3) { return null }
      pt.x++
    } else if (dir == 3) {
      if (pt.x > this.mapWidth - 3 || pt.y > this.mapHeight - 3) { return null }
      pt.x++
      pt.y++
    } else if (dir == 4) {
      if (pt.y > this.mapHeight - 3) { return null }
      pt.y++
    } else if (dir == 5) {
      if (pt.x < 2 || pt.y > this.mapHeight - 3) { return null }
      pt.x--
      pt.y++
    } else if (dir == 6) {
      if (pt.x < 2) { return null }
      pt.x--
    } else if (dir == 7) {
      if (pt.x < 2 || pt.y < 2) { return null }
      pt.x--
      pt.y--
    }
    return pt
  }

  // for debugging
  this.print = function print() {
    for (var i = 0; i < this.tileMap.length; i++) {
      console.log(this.tileMap[i].join(''))
    }
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
