
function TileMap(mapWidth, mapHeight) {
  this.mapWidth = mapWidth
  this.mapHeight = mapHeight

  this.data = TileMap.create(this.mapWidth, this.mapHeight)

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
  this.atDir = function atDir(pt, dir) {
    var pt1
    if (dir == 0) {
      pt1 =  { x: pt.x, y: pt.y - 1 }
    } else if (dir == 1) {
      pt1 =  { x: pt.x + 1, y: pt.y - 1 }
    } else if (dir == 2) {
      pt1 =  { x: pt.x + 1, y: pt.y }
    } else if (dir == 3) {
      pt1 =  { x: pt.x +1 , y: pt.y + 1 }
    } else if (dir == 4) {
      pt1 =  { x: pt.x, y: pt.y + 1 }
    } else if (dir == 5) {
      pt1 =  { x: pt.x - 1, y: pt.y + 1 }
    } else if (dir == 6) {
      pt1 =  { x: pt.x - 1, y: pt.y }
    } else if (dir == 7) {
      pt1 =  { x: pt.x - 1, y: pt.y - 1 }
    }
    return pt1
  }

  this.print = function print() {
    for (var i = 0; i < this.mapHeight; i++) {
      console.log(this.data[i].join(''))
    }
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

module.exports = TileMap
