var DungeonFeature = require('./abstract-dungeon-feature')

var { randInt } = require('../utils')

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
