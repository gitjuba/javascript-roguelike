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
