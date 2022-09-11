var MapGenerator = require('./abstract-map-generator')

var { randInt } = require('../utils')

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
