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
    if (this.overlapsX(that)) {
      return Math.min(Math.abs(this.left + this.width - that.left), Math.abs(that.left + that.width - this.left))
    } else {
      return 0
    }
  }

  this.yDistanceTo = function yDistanceTo(that) {
    if (this.overlapsY(that)) {
      return Math.min(Math.abs(this.top + this.height - that.top), Math.abs(that.top + that.height - this.top))
    } else {
      return 0
    }
  }

  this.distanceTo = function distanceTo(that) {
    return this.xDistanceTo(that) + this.yDistanceTo(that)
  }
}

module.exports = {
  Room
}
