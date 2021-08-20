var monsterDictionary = [
  {
    name: 'small monster',
    char: 'g',
    color: 'red',
    spawnChance: level => 1.0,
    hp: level => [1, 1],
    hitChance: level => [10, 20],
    hitDamage: level => [1, 1]
  },
  {
    name: 'monster',
    char: 'g',
    color: 'darkred',
    spawnChance: level => 0.5 + 0.1 * level,
    hp: level => [1, Math.floor(level / 2)],
    hitChance: level => [10 + level, 20 + 2 * level],
    hitDamage: level => [1, Math.floor(level / 4)]
  },
  {
    name: 'large monster',
    char: 'G',
    color: 'brown',
    spawnChance: level => 0.01 * level,
    hp: level => [5, 5 + level],
    hitChance: level => [10 + level, 20 + 2 * level],
    hitDamage: level => [2, 2 + Math.floor(level / 2)]
  },
  {
    name: 'huge monster',
    char: 'G',
    color: 'darkbrown',
    spawnChance: level => -0.01 + 0.002 * level,
    hp: level => [10, 10 + level],
    hitChance: level => [20 + level, 30 + 2 * level],
    hitDamage: level => [4, 4 + level]
  }
]

function getMonsterDictionaryFor(level) {
  return monsterDictionary.sort((m1, m2) => m1.spawnChance(level) - m2.spawnChance(level))
}
