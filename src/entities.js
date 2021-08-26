var { randInt } = require('./map-generator')

function LivingEntity(char, color) {
  this.char = char
  this.color = color
  this.x = 0
  this.y = 0

  this.hp = 0
  this.hitChance = 0
  this.hitDamage = 0

  this.setPosition = function(position) {
    this.x = position.x
    this.y = position.y
  }

  this.isAdjacentTo = function(that) {
    return Math.max(Math.abs(this.x - that.x), Math.abs(this.y - that.y)) == 1
  }

  this.attack = function(that) {
    if (Math.random() < this.hitChance) {
      that.hp -= this.hitDamage
      return true
    } else {
      return false
    }
  }

  this.getApproachVectorsTo = function(that) {
    var dispX = that.x - this.x
    var dispY = that.y - this.y
    var dx0 = dispX != 0 ? (dispX < 0 ? -1 : 1) : 0
    var dy0 = dispY != 0 ? (dispY < 0 ? -1 : 1) : 0

    var vectors = [{ dx: dx0, dy: dy0 }]

    // If preferred direction along cardinal axis try also both diagonals around it
    if (dx0 == 0) {
      vectors.push({ dx: -1, dy: dy0 })
      vectors.push({ dx: 1, dy: dy0 })
    } else if (dy0 == 0) {
      vectors.push({ dx: dx0, dy: -1 })
      vectors.push({ dx: dx0, dy: 1 })
    } else {
      // Preferred direction is diagonal: try also both cardinal directions around it
      vectors.push({ dx: 0, dy: dy0 })
      vectors.push({ dx: dx0, dy: 0 })
    }

    return vectors
  }
}

function Monster(char, color) {
  LivingEntity.call(this, char, color)

  this.seen = false
  this.aggressive = false
  this.aggravationChance = 0.2

  this.rollAggravation = function() {
    if (this.seen && !this.aggressive && Math.random() < this.aggravationChance) {
      console.log('monster becomes agressive')
      this.aggressive = true
    }
  }
}
Monster.fromSpawner = function(spawner) {
  var monster = new Monster(spawner.char, spawner.color)
  monster.name = spawner.name
  monster.hp = spawner.hp()
  monster.hitChance = spawner.hitChance()
  monster.hitDamage = spawner.hitDamage()
  return monster
}

function Player(char, color) {
  LivingEntity.call(this, char, color)

  this.hp = 10
  this.hitChance = 0.5
  this.hitDamage = 2

  this.visRadius = 7.5
  this.attacking = false

  this.isWithinVisRadius = function(i, j) {
    return (this.x - j) ** 2 + (this.y - i) ** 2 < this.visRadius ** 2
  }
}

module.exports = {
  Monster,
  Player
}
