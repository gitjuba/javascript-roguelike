var { mapWidth, mapHeight } = require('../layout')

function DungeonFeature() {
  this.isApplicableTo = function isApplicableTo(level) {
    throw new Error('Use one of the child classes')
  }

  this.addToLevel = function addToLevel(level) {
    throw new Error('Use one of the child classes')
  }
}

module.exports = DungeonFeature
