var MapGenerator = require('./abstract-map-generator')
var { Room } = require('./mapgen-commons')
var { randFloat, randInt } = require('../utils')

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

  this.splitVertically = function splitVertically(ratio) {
    var upperHeight = Math.floor(ratio * this.height)

    var upperPart = this.clone()
    upperPart.height = upperHeight
    this.firstChild = upperPart
    upperPart.parent = this

    var lowerPart = this.clone()
    lowerPart.top = upperPart.top + upperHeight
    lowerPart.height = this.height - upperHeight
    this.secondChild = lowerPart
    lowerPart.parent = this

    return [upperPart, lowerPart]
  }

  this.splitHorizontally = function splitHorizontally(ratio) {
    var leftWidth = Math.floor(ratio * this.width)

    var leftPart = this.clone()
    leftPart.width = leftWidth
    this.firstChild = leftPart
    leftPart.parent = this

    var rightPart = this.clone()
    rightPart.left = leftPart.left + leftWidth
    rightPart.width = this.width - leftWidth
    this.secondChild = rightPart
    rightPart.parent = this

    return [leftPart, rightPart]
  }

  this.split = function split(ratio) {
    var splitVertically
    if (this.width < params.partitionWidthThreshold) {
      splitVertically = true
    } else if (this.height < params.partitionHeightThreshold) {
      splitVertically = false
    } else {
      splitVertically = Math.random() < this.height / (this.width + this.height)
    }

    if (splitVertically) {
      return this.splitVertically(ratio)
    } else {
      return this.splitHorizontally(ratio)
    }
  }
}

function BinarySpacePartitionMapGenerator(level) {
  MapGenerator.call(this, level)

  this.rooms = []
  this.corridors = []
  this.features = {}

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

        this.carveRoom(node.room)
      }
    })

    function connectChildren(node) {
      if (!node.isLeafNode()) {
        if (node.firstChild.isLeafNode() && node.secondChild.isLeafNode()) {
          if (node.firstChild.hasRoom() && node.secondChild.hasRoom()) {
            console.log('connecting leaf nodes')
          } else {
            console.log('leaf siblings, one of which has no room')
          }
        } else {
          connectChildren(node.firstChild)
          connectChildren(node.secondChild)
        }
      }
    }

    connectChildren(nodes[0])
  }

  this.carveRoom = function carveRoom(room) {
    for (var i = room.top; i < room.top + room.height; i++) {
      for (var j = room.left; j < room.left + room.width; j++) {
        this.tileMap[i][j] = '.'
      }
    }
  }
}

module.exports = BinarySpacePartitionMapGenerator
