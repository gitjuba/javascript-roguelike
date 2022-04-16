var MapGenerator = require('./abstract-map-generator')
var { Room } = require('./mapgen-commons')

var { randInt } = require('../utils')

var params = {
  minRoomWidth: 5,
  maxRoomWidth: 15,
  minRoomHeight: 3,
  maxRoomHeight: 7,

  maxNumberOfRooms: 10,
  targetMapFillRatio: 0.33,
  maxFailuresToAddRoom: 100
}

function RandomRoomsMapGenerator(level) {
  MapGenerator.call(this, level)

  this.rooms = []
  this.corridors = []
  this.features = {}

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

    var iSrc = 0, iDest = 1
    while (iSrc < this.rooms.length && iDest < this.rooms.length) {
      var srcRoom = this.rooms[iSrc]
      var destRoom = this.rooms[iDest]

      var pSrc = srcRoom.getRandomPosition()
      var xSrc = pSrc.x
      var ySrc = pSrc.y
      var pDest = destRoom.getRandomPosition()
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

      iSrc = iDest
      while (iDest < this.rooms.length && this.rooms[iDest].connected) {
        iDest += 1
      }
    }

    this.updateTileMap()
  }

  this.carveRoom = function carveRoom(room) {
    for (var i = room.top; i < room.top + room.height; i++) {
      for (var j = room.left; j < room.left + room.width; j++) {
        this.tileMap[i][j] = '.'
      }
    }
  }

  this.updateTileMap = function updateTileMap() {
    this.rooms.forEach(room => {
      this.carveRoom(room)
    })
    this.corridors.forEach(corridor => {
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
    this.tileMap[position.y][position.x] = direction == 'up' ? '<' : '>'
  }

  this.placeDownStaircase = function placeDownStaircase() {
    this.placeStaircase('down')
  }

  this.placeUpStaircase = function placeUpStaircase() {
    this.placeStaircase('up')
  }
}

module.exports = RandomRoomsMapGenerator
