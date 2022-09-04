var { randInt } = require('../utils')

function Room(top, left, width, height) {
  this.top = top
  this.left = left
  this.width = width
  this.height = height

  this.connected = false

  this.area = function area() {
    return this.width * this.height
  }

  this.getRandomPosition = function getRandomPosition() {
    return {
      x: randInt(this.left, this.left + this.width - 1),
      y: randInt(this.top, this.top + this.height - 1)
    }
  }

  this.getRandomEdgePosition = function getRandomEdgePosition(edge) {
    // edge: 0 north, 1 east, 2 south, 3 west
    var pt = { x: 0, y: 0 }
    if (edge == 0) {
      pt.x = this.left + randInt(0, this.width - 1)
      pt.y = this.top
    } else if (edge == 1) {
      pt.x = this.left + this.width - 1
      pt.y = this.top + randInt(0, this.height - 1)
    } else if (edge == 2) {
      pt.x = this.left + randInt(0, this.width - 1)
      pt.y = this.top + this.height - 1
    } else if (edge == 3) {
      pt.x = this.left
      pt.y = this.top + randInt(0, this.height - 1)
    }
    return pt
  }

  this.overlapsX = function overlapsX(that) {
    return (
      that.left - this.width <= this.left &&
      this.left <= that.left + that.width
    )
  }

  this.overlapsY = function overlapsY(that) {
    return (
      that.top - this.height <= this.top &&
      this.top <= that.top + that.height
    )
  }

  this.overlaps = function overlaps(that) {
    return this.overlapsX(that) && this.overlapsY(that)
  }

  this.xDistanceTo = function xDistanceTo(that) {
    if (!this.overlapsX(that)) {
      return Math.min(Math.abs(this.left + this.width - that.left), Math.abs(that.left + that.width - this.left))
    } else {
      return 0
    }
  }

  this.yDistanceTo = function yDistanceTo(that) {
    if (!this.overlapsY(that)) {
      return Math.min(Math.abs(this.top + this.height - that.top), Math.abs(that.top + that.height - this.top))
    } else {
      return 0
    }
  }

  this.distanceTo = function distanceTo(that) {
    return this.xDistanceTo(that) + this.yDistanceTo(that)
  }

  // Two-segment corridor
  this.getCorridorTo = function getCorridorTo(that) {
    var pSrc = this.getRandomPosition()
    var xSrc = pSrc.x
    var ySrc = pSrc.y
    var pDest = that.getRandomPosition()
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

    return [firstLeg, secondLeg]
  }
}

module.exports = {
  Room
}
