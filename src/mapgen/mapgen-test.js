var RRMG = require('./random-rooms-map-generator')
var BSPMG = require('./binary-space-partition-map-generator')

var generator = new BSPMG(0)

generator.generate()
generator.print()
