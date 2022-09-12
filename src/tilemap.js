var allDirections = [0, 1, 2, 3, 4, 5, 6, 7]
var cardinalDirections = [0, 2, 4, 6]

function TileMap(mapWidth, mapHeight, char) {
  this.mapWidth = mapWidth
  this.mapHeight = mapHeight

  this.data = TileMap.create(this.mapWidth, this.mapHeight, char)

  this.at = function at(pt) {
    return this.data[pt.y][pt.x]
  }

  this.put = function put(pt, char) {
    this.data[pt.y][pt.x] = char
  }

  this.inBounds = function inBounds(pt) {
    return (pt.x > 0 && pt.x < this.mapWidth - 1 && pt.y > 0 && pt.y < this.mapHeight)
  }

  // directions 0: north, 1: northeast, 2: east, ..., 7: northwest
  this.toDir = function toDir(pt, dir) {
    var pt1
    if (dir == 0) {
      pt1 = { x: pt.x, y: pt.y - 1 }
    } else if (dir == 1) {
      pt1 = { x: pt.x + 1, y: pt.y - 1 }
    } else if (dir == 2) {
      pt1 = { x: pt.x + 1, y: pt.y }
    } else if (dir == 3) {
      pt1 = { x: pt.x + 1, y: pt.y + 1 }
    } else if (dir == 4) {
      pt1 = { x: pt.x, y: pt.y + 1 }
    } else if (dir == 5) {
      pt1 = { x: pt.x - 1, y: pt.y + 1 }
    } else if (dir == 6) {
      pt1 = { x: pt.x - 1, y: pt.y }
    } else if (dir == 7) {
      pt1 = { x: pt.x - 1, y: pt.y - 1 }
    }
    return pt1
  }

  this.atDir = function atDir(pt, dir) {
    var pt1 = this.toDir(pt, dir)
    return this.at(pt1)
  }

  this.atDirs = function atDirs(pt, dirs) {
    return dirs.map(dir => this.atDir(pt, dir))
  }

  this.aroundDir = function aroundDir(pt, dir) {
    // what would be an efficient way to view environments?
    if (dir >= 0) {
      var dirs = [dir - 1, dir, dir + 1].map(d => {
        var dd = d % 8
        if (dd < 0) {
          dd += 8
        }
        return dd
      })
    } else {
      var dirs = [0, 1, 2, 3, 4, 5, 6, 7]
    }
    return this.atDirs(pt, dirs)
  }

  // for wayfinding
  this.accessibleEnvironment = function accessibleEnvironment(pt) {
    var points = allDirections.map(dir => this.toDir(pt, dir)).filter(this.inBounds.bind(this))
    var accessiblePoints = points.filter(p => this.at(p) == '.')
    return accessiblePoints
  }

  this.print = function print() {
    for (var i = 0; i < this.mapHeight; i++) {
      console.log(this.data[i].join(''))
    }
  }

  this.copy = function copy() {
    var copy = new TileMap(this.mapWidth, this.mapHeight)
    for (var i = 0; i < this.mapHeight; i++) {
      for (var j = 0; j < this.mapWidth; j++) {
        var pt = { x: j, y: i }
        copy.put(pt, this.at(pt))
      }
    }
    return copy
  }
}

TileMap.create = function create(width, height, char = '#') {
  var arr = Array(height)
  for (var i = 0; i < height; i++) {
    arr[i] = Array(width)
    for (var j = 0; j < width; j++) {
      arr[i][j] = char
    }
  }
  return arr
}

TileMap.fromString = function fromString(str) {
  var rows = str.split('\n').filter(row => row.length > 0)
  if (rows.some(row => row.length != rows[0].length)) {
    throw new Error('Invalid tile map string')
  }
  var mapWidth = rows[0].length
  var mapHeight = rows.length
  var tileMap = new TileMap(mapWidth, mapHeight)
  for (var i = 0; i < mapHeight; i++) {
    for (var j = 0; j < mapWidth; j++) {
      var pt = { x: j, y: i }
      tileMap.put(pt, rows[i][j])
    }
  }
  return tileMap
}

module.exports = TileMap
