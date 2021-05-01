function randInt(n0, n1) {
  return n0 + Math.floor((n1 - n0 + 1) * Math.random())
}

function overlapRooms(r1, r2) {
  return (
    r2.x - r1.w <= r1.x &&
    r1.x <= r2.x + r2.w &&
    r2.y - r1.h <= r1.y &&
    r1.y <= r2.y + r2.h
  )
}

function getRandomRoomPosition(level) {
  var iRoom = randInt(0, level.rooms.length - 1)
  var room = level.rooms[iRoom]
  var x = randInt(room.x, room.x + room.w - 1)
  var y = randInt(room.y, room.y + room.h - 1)
  return { x, y }
}

// eslint-disable-next-line no-unused-vars
function generateLevel(mapWidth, mapHeight, features) {
  var mapArea = mapWidth * mapHeight

  var rooms = []

  // Minimum and maximum room width and height
  var w0 = 5
  var w1 = 15

  var h0 = 3
  var h1 = 7

  var roomArea = 0
  var failures = 0

  // Random integer from {n0, ..., n1} (uniform)
  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    var w = randInt(w0, w1)
    var h = randInt(h0, h1)
    // Last index mapWidth - 1, room width + 1 tile wall
    var x = randInt(1, mapWidth - 1 - (w + 1))
    var y = randInt(1, mapHeight - 1 - (h + 1))
    let overlap = false
    for (var iRoom = 0; iRoom < rooms.length; iRoom++) {
      var room = rooms[iRoom]
      if (overlapRooms(room, { x, y, w, h })) {
        overlap = true
        break
      }
    }
    if (overlap) {
      failures += 1
      if (failures > 100) {
        break
      }
      continue
    }
    // console.log('placing room, w=' + w + ', h=' + h + ', x=' + x + ', y=' + y)
    rooms.push({
      x,
      y,
      w,
      h,
      c: false, // connected
    })
    roomArea += w * h
    /*
    console.log(
      'placed ' +
        rooms.length +
        ' rooms with area ' +
        roomArea +
        ' of ' +
        mapArea
    )
    */
    if (roomArea / mapArea > 0.33 || rooms.length > 10) {
      break
    }
  }

  var corridors = []
  var corridorsAsRooms = []

  // Start placing connectiong with rooms 0 and 1
  var j = 0,
    k = 1

  while (j < rooms.length && k < rooms.length) {
    var room_j = rooms[j]
    var room_k = rooms[k]
    // console.log('corridor between ' + j + ' and ' + k)

    // Pick two points within these rooms at random
    var xj = randInt(room_j.x, room_j.x + room_j.w - 1)
    var yj = randInt(room_j.y, room_j.y + room_j.h - 1)

    var xk = randInt(room_k.x, room_k.x + room_k.w - 1)
    var yk = randInt(room_k.y, room_k.y + room_k.h - 1)

    // Starting direction of corridor at random
    var dir = randInt(0, 1)
    var xjk, yjk
    if (dir) {
      // vertically from room j
      xjk = xj
      yjk = yk
    } else {
      // horizontally from room j
      xjk = xk
      yjk = yj
    }

    var c = {
      xj,
      yj,
      xjk,
      yjk,
      xk,
      yk,
    }
    corridors.push(c)

    // Corridor as two (single tile wide) rooms
    var c1, c2
    if (dir) {
      c1 = {
        x: xj,
        y: Math.min(yj, yk),
        w: 1,
        h: Math.abs(yj - yk) + 1,
      }
      c2 = {
        x: Math.min(xj, xk),
        y: yk,
        w: Math.abs(xj - xk) + 1,
        h: 1,
      }
    } else {
      c1 = {
        x: Math.min(xj, xk),
        y: yj,
        w: Math.abs(xj - xk) + 1,
        h: 1,
      }
      c2 = {
        x: xk,
        y: Math.min(yj, yk),
        w: 1,
        h: Math.abs(yj - yk) + 1,
      }
    }

    corridorsAsRooms.push(c1)
    corridorsAsRooms.push(c2)

    // Loop over unconnected rooms, see if new corridor overlaps them
    rooms[j].connected = true
    rooms[k].connected = true

    for (var i = 0; i < rooms.length; i++) {
      var r = rooms[i]
      if (r.connected) {
        // console.log('room ' + i + ' already connected')
        continue
      }
      let overlap = overlapRooms(r, c1) || overlapRooms(r, c2)

      if (overlap) {
        /*
        console.log(
          'room ' +
            JSON.stringify(rooms[i]) +
            ' overlaps with corridor ' +
            JSON.stringify(c)
        )
        */
        rooms[i].connected = true
      }
    }

    // Re-assign j and k so that j is a connected room and k non-connected
    j = k
    while (k < rooms.length && rooms[k].connected) {
      k++
    }
  }

  var levelMap = {
    rooms,
    corridors: corridorsAsRooms,
  }

  if (features.up) {
    // Staircase up
    var upPos = getRandomRoomPosition(levelMap)
    levelMap.up = { x: upPos.x, y: upPos.y }
  }
  if (features.down) {
    // Staircase down
    var downPos = getRandomRoomPosition(levelMap)
    levelMap.down = { x: downPos.x, y: downPos.y }
  }

  return levelMap
}

/*
// Testing code
var mapWidth = 70
var mapHeight = 20

var levelMap = generateLevel(mapWidth, mapHeight)

var tileMap = `
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
######################################################################
`
  .trim()
  .split('\n')
  .map((row) => row.split(''))

function carveRoom(room, level) {
  for (var i = room.y; i < room.y + room.h; i++) {
    for (var j = room.x; j < room.x + room.w; j++) {
      level[i][j] = '.'
    }
  }
}

levelMap.rooms.forEach((room) => {
  carveRoom(room, tileMap)
})
levelMap.corridors.forEach((room) => {
  carveRoom(room, tileMap)
})

tileMap.forEach((row) => {
  console.log(row.join(''))
})
*/
