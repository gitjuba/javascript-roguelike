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

    this.placeRandomCorridors()

    this.updateTileMap()

    // this.randomWalkCorridorPlacement()
  }

  this.canAdvanceTo = function canAdvanceTo(pt, dir, steps) {
    if (dir == 0) {
      return pt.y > steps
    } else if (dir == 1) {
      return pt.x < this.mapWidth - 1 - steps
    } else if (dir == 2) {
      return pt.y < this.mapHeight - 1 - steps
    } else if (dir == 3) {
      return pt.x > steps
    }
  }

  this.getPointInDirection = function getPointInDirection(pt, dir, steps) {
    if (dir == 0) {
      return { x: pt.x, y: pt.y - steps }
    } else if (dir == 1) {
      return { x: pt.x + steps, y: pt.y }
    } else if (dir == 2) {
      return { x: pt.x, y: pt.y + steps }
    } else if (dir == 3) {
      return { x: pt.x - steps, y: pt.y }
    }
  }

  this.canDigTo = function canDigTo(pt, dir, steps) {
    var canAdvance = this.canAdvanceTo(pt, dir, steps)
    if (canAdvance) {
      for (var i = 1; i <= steps; i++) {
        var pt1 = this.getPointInDirection(pt, dir, i)
        if (this.distToRooms[pt1.y][pt1.x] < 0) {
          return false
        }
      }
      return true
    } else {
      return false
    }
  }

  this.randomWalkCorridorPlacement = function randomWalkCorridorPlacement() {
    // TODO Break loop when distToRooms full
    for (var dist = 1; dist < 10; dist++) {
      for (var iRoom = 0; iRoom < this.rooms.length; iRoom++) {
        var room = this.rooms[iRoom]
        var jLeft = room.left - dist
        var jRight = room.left + room.width - 1 + dist
        var iTop = room.top - dist
        var iBottom = room.top + room.height - 1 + dist

        for (var i = room.top - dist; i < room.top + room.height + dist; i++) {
          if (i > 0 && i < this.mapHeight - 1 && jLeft > 0 && this.distToRooms[i][jLeft] < 0) {
            this.distToRooms[i][jLeft] = dist
          }
          if (i > 0 && i < this.mapHeight - 1 && jRight < this.mapWidth - 1 && this.distToRooms[i][jRight] < 0) {
            this.distToRooms[i][jRight] = dist
          }
        }

        for (var j = room.left - dist; j < room.left + room.width + dist; j++) {
          if (j > 0 && j < this.mapWidth - 1 && iTop > 0 && this.distToRooms[iTop][j] < 0) {
            this.distToRooms[iTop][j] = dist
          }
          if (j > 0 && j < this.mapWidth - 1 && iBottom < this.mapHeight - 1 && this.distToRooms[iBottom][j] < 0) {
            this.distToRooms[iBottom][j] = dist
          }
        }

      }
    }

    for (var iRoom = 0; iRoom < this.rooms.length; iRoom++) {
      var room = this.rooms[iRoom]
      this.distToRooms[room.top - 1][room.left - 1] = -1
      this.distToRooms[room.top - 1][room.left + room.width] = -1
      this.distToRooms[room.top + room.height][room.left - 1] = -1
      this.distToRooms[room.top + room.height][room.left + room.width] = -1
    }

    do {
      var startingRoom = this.rooms[randInt(0, this.rooms.length - 1)]
      var startingEdge = randInt(0, 3)
      var pt = startingRoom.getRandomEdgePosition(startingEdge)
    } while (!this.canDigTo(pt, startingEdge, 2))

    // var pt = startingRoom.getRandomPosition()
    console.log('start from ' + pt.x + ', ' + pt.y)
    this.tileMap[pt.y][pt.x] = 'x'
    var walkLength = 0
    var prevDist = 0
    var prevDir = startingEdge
    var dir = startingEdge // facing the wall
    var turn = 0
    var pathMarker = '.'
    var walkedThisTurn
    while (this.rooms.some(room => !room.connected)) {
      if (walkLength > 10000) {
        break
      }
      walkedThisTurn = false
      if (this.canDigTo(pt, dir, 1)) {
        walkedThisTurn = true
        pt = this.getPointInDirection(pt, dir, 1)
        this.tileMap[pt.y][pt.x] = pathMarker
        if (turn != 0) {
          // TODO: Mark "inside of turn" as impassable
        }
      }

      if (walkedThisTurn) {
        if (this.distToRooms[pt.y][pt.x] == 1) {
          if (dir == 1 || dir == 3) {
            if (this.distToRooms[pt.y + 1][pt.x] == 1) {
              this.distToRooms[pt.y + 1][pt.x] = -1
            }
            if (this.distToRooms[pt.y - 1][pt.x] == 1) {
              this.distToRooms[pt.y - 1][pt.x] = -1
            }
          }
          if (dir == 0 || dir == 2) {
            if (this.distToRooms[pt.y][pt.x + 1] == 1) {
              this.distToRooms[pt.y][pt.x + 1] = -1
            }
            if (this.distToRooms[pt.y][pt.x - 1] == 1) {
              this.distToRooms[pt.y][pt.x - 1] = -1
            }
          }
        }

        if (this.distToRooms[pt.y][pt.x] == 0) {
          // force point and direction
          turn = 0
          var currentRoom = this.rooms[this.roomIndex[pt.y][pt.x]]
          do {
            dir = randInt(0, 3)
            pt = currentRoom.getRandomEdgePosition(dir)
          } while (!this.canDigTo(pt, dir, 2))
          // this.tileMap[pt.y][pt.x] = 'x'
        } else if (this.distToRooms[pt.y][pt.x] == 1) {
          turn = 0
        } else {
          turn = randInt(-1, 1)
        }
      } else {
        dir = prevDir // move not made
        if (turn == -1) {
          turn = randInt(0, 1)
        } else if (turn == 0) {
          turn = (randInt(0, 1) - 0.5) * 2
        } else if (turn == 1) {
          turn = randInt(-1, 0)
        }
      }

      prevDir = dir
      dir = (dir + turn) % 4
      if (dir < 0) {
        dir += 4
      }
      prevDist = this.distToRooms[pt.y][pt.x]
      this.print()
      console.log('')
      walkLength++
    }
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

  this.carveRoom = function carveRoom(room, char = '.', roomIndex = -1) {
    for (var i = room.top; i < room.top + room.height; i++) {
      for (var j = room.left; j < room.left + room.width; j++) {
        this.tileMap[i][j] = char
        this.distToRooms[i][j] = 0
        if (roomIndex > -1) {
          this.roomIndex[i][j] = roomIndex
        }
      }
    }
  }

  this.updateTileMap = function updateTileMap() {
    this.rooms.forEach((room, ind) => {
      this.carveRoom(room, '.', ind)
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
