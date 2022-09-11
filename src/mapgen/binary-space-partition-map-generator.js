var MapGenerator = require('./abstract-map-generator')
var { Room } = require('./mapgen-commons')
var { randFloat, randInt } = require('../utils')

const AXIS_HORIZONTAL = 1
const AXIS_VERTICAL = 2

var params = {
  minRoomWidth: 5,
  maxRoomWidth: 15,
  minRoomHeight: 3,
  maxRoomHeight: 7,

  maxNumberOfRooms: 10,
  targetMapFillRatio: 0.33,
  maxFailuresToAddRoom: 100,

  minSplitRatio: 0.2,
  maxSplitRatio: 0.8,

  partitionWidthThreshold: 19,
  partitionHeightThreshold: 14
}

function Node(top, left, width, height) {
  this.top = top
  this.left = left
  this.width = width
  this.height = height

  this.parent = null
  this.splitAxis = null // split axis of parent
  this.firstChild = null
  this.secondChild = null

  this.room = null

  this.isLeafNode = function isLeafNode() {
    return this.firstChild == null && this.secondChild == null
  }

  this.canContainRoom = function canContainRoom() {
    return this.width >= params.minRoomWidth + 2 && this.height >= params.minRoomHeight + 2
  }

  this.hasRoom = function hasRoom() {
    return this.room != null
  }

  this.clone = function clone() {
    return new Node(this.top, this.left, this.width, this.height)
  }

  this.splitAlongHorizontal = function splitAlongHorizontal(ratio) {
    var upperHeight = Math.floor(ratio * this.height)

    var upperPart = this.clone()
    upperPart.splitAxis = AXIS_HORIZONTAL
    upperPart.height = upperHeight
    this.firstChild = upperPart
    upperPart.parent = this

    var lowerPart = this.clone()
    lowerPart.splitAxis = AXIS_HORIZONTAL
    lowerPart.top = upperPart.top + upperHeight
    lowerPart.height = this.height - upperHeight
    this.secondChild = lowerPart
    lowerPart.parent = this

    return [upperPart, lowerPart]
  }

  this.splitAlongVertical = function splitAlongVertical(ratio) {
    var leftWidth = Math.floor(ratio * this.width)

    var leftPart = this.clone()
    leftPart.splitAxis = AXIS_VERTICAL
    leftPart.width = leftWidth
    this.firstChild = leftPart
    leftPart.parent = this

    var rightPart = this.clone()
    rightPart.splitAxis = AXIS_VERTICAL
    rightPart.left = leftPart.left + leftWidth
    rightPart.width = this.width - leftWidth
    this.secondChild = rightPart
    rightPart.parent = this

    return [leftPart, rightPart]
  }

  this.split = function split(ratio) {
    var splitAlongHorizontal
    if (this.width < params.partitionWidthThreshold) {
      splitAlongHorizontal = true
    } else if (this.height < params.partitionHeightThreshold) {
      splitAlongHorizontal = false
    } else {
      splitAlongHorizontal = Math.random() < this.height / (this.width + this.height)
    }

    if (splitAlongHorizontal) {
      return this.splitAlongHorizontal(ratio)
    } else {
      return this.splitAlongVertical(ratio)
    }
  }

  this.getDescendantRooms = function getDescendantRooms() {
    var rooms = []
    if (this.hasRoom()) {
      rooms.push(this.room)
    }
    if (!this.isLeafNode()) {
      rooms = rooms.concat(this.firstChild.getDescendantRooms())
      rooms = rooms.concat(this.secondChild.getDescendantRooms())
    }
    return rooms
  }
}

function BinarySpacePartitionMapGenerator(level) {
  MapGenerator.call(this, level)

  this.rooms = []
  this.corridors = []
  this.features = {}

  var self = this

  this.generate = function generate() {
    var nodes = [
      new Node(0, 0, this.mapWidth, this.mapHeight)
    ]
    function split(node) {
      if (node.width < params.partitionWidthThreshold && node.height < params.partitionHeightThreshold) {
        return
      } else {
        var splitRatio = randFloat(params.minSplitRatio, params.maxSplitRatio)
        var children = node.split(splitRatio)
        children.forEach(child => {
          nodes.push(child)
          split(child)
        })
      }
    }

    split(nodes[0])

    nodes.forEach(node => {
      if (node.isLeafNode() && node.canContainRoom()) {
        var roomWidth = randInt(params.minRoomWidth, node.width - 2)
        var roomHeight = randInt(params.minRoomHeight, node.height - 2)
        var roomLeft = randInt(node.left + 1, node.left + node.width - 1 - (roomWidth + 1))
        var roomTop = randInt(node.top + 1, node.top + node.height - 1 - (roomHeight + 1))

        node.room = new Room(roomTop, roomLeft, roomWidth, roomHeight)

        self.rooms.push(node.room)
        self.carveRoom(node.room)
      }
    })

    function connectDescendants(node) {
      if (node.isLeafNode()) {
        return
      }
      var firstRooms = node.firstChild.getDescendantRooms()
      var secondRooms = node.secondChild.getDescendantRooms()
      var minDistance = Infinity
      var firstRoom = null
      var secondRoom = null
      firstRooms.forEach(room1 => {
        secondRooms.forEach(room2 => {
          var distance = room1.distanceTo(room2)
          if (distance < minDistance) {
            firstRoom = room1
            secondRoom = room2
            minDistance = distance
          }
        })
      })
      if (firstRoom && secondRoom) {
        [firstLeg, secondLeg] = firstRoom.getCorridorTo(secondRoom)
        self.corridors.push(firstLeg)
        self.corridors.push(secondLeg)
        self.carveRoom(firstLeg)
        self.carveRoom(secondLeg)
      }
      connectDescendants(node.firstChild)
      connectDescendants(node.secondChild)
    }

    connectDescendants(nodes[0])
  }

  this.carveRoom = function carveRoom(room) {
    for (var i = room.top; i < room.top + room.height; i++) {
      for (var j = room.left; j < room.left + room.width; j++) {
        var pt = { x: j, y: i }
        this.tileMap.put(pt, '.')
      }
    }
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

module.exports = BinarySpacePartitionMapGenerator
