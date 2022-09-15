var DungeonFeature = require('./abstract-dungeon-feature')

var { randInt } = require('../utils')

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
