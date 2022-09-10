var RRMG = require('./random-rooms-map-generator')
var BSPMG = require('./binary-space-partition-map-generator')
var RWMG = require('./random-walk-map-generator')

var EDF = require('./erosion-dungeon-feature')

// var generator = new RWMG(0)
var generator = new RRMG(0)
// var generator = new BSPMG(0)

generator.generate()

var feature = new EDF()
feature.addToLevel(generator)

generator.print()
