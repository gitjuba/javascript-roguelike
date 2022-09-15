// hash 3*dx + dy
// Is this necessary?
var displacementToDir = {
  '-4': 7,
  '-3': 6,
  '-2': 5,
  '-1': 0,
  '0': -1,
  '1': 4,
  '2': 1,
  '3': 2,
  '4': 3
}

function LivingEntity(char, color) {
  this.char = char
  this.color = color
  this.x = 0
  this.y = 0

  this.hp = 0
  this.hitChance = 0
  this.hitDamage = 0

  this.setPosition = function setPosition(position) {
    this.x = position.x
    this.y = position.y
  }

  this.isAdjacentTo = function isAdjacentTo(that) {
    return Math.max(Math.abs(this.x - that.x), Math.abs(this.y - that.y)) == 1
  }

  this.directionTo = function directionTo(that) {
    var dx = Math.sign(that.x - this.x)
    var dy = Math.sign(that.y - this.y)
    return displacementToDir[3 * dx + dy]
  }

  this.attack = function attack(that) {
    if (Math.random() < this.hitChance) {
      that.hp -= this.hitDamage
      return true
    } else {
      return false
    }
  }

  this.getApproachVectorsTo = function getApproachVectorsTo(that) {
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
  this.pointValue = null

  this.rollAggravation = function rollAggravation() {
    if (this.seen && !this.aggressive && Math.random() < this.aggravationChance) {
      console.log('monster becomes agressive')
      this.aggressive = true
    }
  }
}
Monster.fromSpawner = function(spawner) {
  var monster = new Monster(spawner.char, spawner.color)
  monster.name = spawner.name
  monster.pointValue = spawner.pointValue
  monster.hp = spawner.hp()
  monster.hitChance = spawner.hitChance()
  monster.hitDamage = spawner.hitDamage()
  return monster
}

function Player(char, color, playerName) {
  LivingEntity.call(this, char, color)

  this.hp = 10
  this.hitChance = 0.5
  this.hitDamage = 2

  this.visRadius = 7.5
  this.attacking = false

  this.name = playerName
  this.score = 0

  this.route = []

  this.isWithinVisRadius = function isWithinVisRadius(i, j) {
    return (this.x - j) ** 2 + (this.y - i) ** 2 < this.visRadius ** 2
  }

  this.isEnRoute = function isEnRoute() {
    return this.route.length > 0
  }
}

module.exports = {
  Monster,
  Player
}
