function Wayfinder() {
  this.getRouteBetween = function getRouteBetween(start, finish, tileMap) {
    // debugging
    var statusMap = tileMap.copy()
    statusMap.put(start, 's')
    // A* algorithm
    var openSet = [start]
    var gScore = {}
    var fScore = {}
    var cameFrom = {}
    var route = []
    function hScore(p) {
      return Math.max(Math.abs(p.x - finish.x), Math.abs(p.y - finish.y))
    }
    function hash(p) {
      return 100 * p.x + p.y
    }
    start.hash = hash(start)
    finish.hash = hash(finish)
    fScore[start.hash] = hScore(start)
    gScore[start.hash] = 0

    var maxIter = 1000
    var iIter = 0
    while (openSet.length > 0) {
      var minScore = Infinity
      var current
      var currentInd
      for (var i = 0; i < openSet.length; i++) {
        if (fScore[openSet[i].hash] < minScore) {
          minScore = fScore[openSet[i].hash]
          current = openSet[i]
          currentInd = i
        }
      }
      openSet.splice(currentInd, 1)
      statusMap.put(current, '-')

      if (current.hash == finish.hash) {
        console.log('done')
        route = [current]
        while (current.hash in cameFrom) {
          current = cameFrom[current.hash]
          route.unshift(current)
        }
        break
      }
      var neighborhood = tileMap.accessibleEnvironment(current)
      for (var neighbor of neighborhood) {
        neighbor.hash = hash(neighbor)
        if (!(neighbor.hash in gScore) || (gScore[neighbor.hash] > gScore[current.hash] + 1)) {
          gScore[neighbor.hash] = gScore[current.hash] + 1
          fScore[neighbor.hash] = gScore[neighbor.hash] + hScore(neighbor)
          cameFrom[neighbor.hash] = current

          if (!openSet.find(p => p.hash == neighbor.hash)) {
            openSet.push(neighbor)
            statusMap.put(neighbor, 'o')
          }
        }
      }
      iIter++

      statusMap.print()
      console.log('\n')

      if (iIter > maxIter) {
        break
      }
    }
    for (node of route) {
      console.log(node)
      statusMap.put(node, '@')
    }

    statusMap.print()
    return route
  }
}

module.exports = Wayfinder
