var { randInt } = require('./utils')

var monsterDictionary = [
  {
    name: 'small monster',
    char: 'g',
    color: '#f00',
    pointValue: level => level * 1 + 1,
    spawnWeight: level => 1 / (level + 1),
    hp: level => [1, 1],
    hitChance: level => [10, 20],
    hitDamage: level => [1, 1]
  },
  {
    name: 'monster',
    char: 'g',
    color: '#a00',
    pointValue: level => level * 2 + 2,
    spawnWeight: level => 1.0,
    hp: level => [1, 1 + Math.floor(level / 2)],
    hitChance: level => [10 + level, 20 + 2 * level],
    hitDamage: level => [1, 1 + Math.floor(level / 4)]
  },
  {
    name: 'large monster',
    char: 'G',
    color: '#a50',
    pointValue: level => level * 3 + 3,
    spawnWeight: level => level / 20,
    hp: level => [5, 5 + level],
    hitChance: level => [10 + level, 20 + 2 * level],
    hitDamage: level => [2, 2 + Math.floor(level / 2)]
  },
  {
    name: 'huge monster',
    char: 'G',
    color: '#840',
    pointValue: level => level * 4 + 4,
    spawnWeight: level => level / 500,
    hp: level => [10, 10 + level],
    hitChance: level => [20 + level, 30 + 2 * level],
    hitDamage: level => [4, 4 + level]
  }
]

function generateSpawnerFrom(entry, level) {
  var hpBounds = entry.hp(level)
  var hitChanceBounds = entry.hitChance(level)
  var hitDamageBounds = entry.hitDamage(level)
  var pointValue = entry.pointValue(level)
  return {
    name: entry.name,
    char: entry.char,
    color: entry.color,
    pointValue,
    hp: () => randInt(hpBounds[0], hpBounds[1]),
    hitChance: () => randInt(hitChanceBounds[0], hitChanceBounds[1]) / 100,
    hitDamage: () => randInt(hitDamageBounds[0], hitDamageBounds[1])
  }
}

function rollMonster(level) {
  var roll = Math.random()
  var weightSum = monsterDictionary.reduce((acc, curr) => acc + curr.spawnWeight(level), 0)
  var cumulativeWeight = 0
  for (var i = 0; i < monsterDictionary.length; i++) {
    var entry = monsterDictionary[i]
    cumulativeWeight += entry.spawnWeight(level) / weightSum
    if (roll < cumulativeWeight) {
      var spawner = generateSpawnerFrom(entry, level)
      return spawner
    }
  }
}

module.exports = {
  rollMonster,
}
