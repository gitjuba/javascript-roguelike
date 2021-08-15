/* global randInt, getRandomRoomPosition, generateLevel, charOffsetX, charOffsetY, charMap */

var statsCanvas = document.getElementById('stats')
var logCanvas = document.getElementById('log')
var colorCanvas = document.getElementById('color')
var visibleCanvas = document.getElementById('visible')
var levelCanvas = document.getElementById('level')
var seenCanvas = document.getElementById('seen')
var objectCanvas = document.getElementById('objects')
var debugCanvas = document.getElementById('debug')

// Code page 850 character sheet (Base64 encoded PNG file)
var charsImgOpaque = document.getElementById('chars')
var charsImgAlpha = document.getElementById('chars-alpha')
var charWidthPixels = 9
var charHeightPixels = 14

// Screen divided to map, stats and log
var mapWidth = 70
var mapHeight = 20

var statsWidth = 10
var statsHeight = 20

var logWidth = 80
var logHeight = 5

var charsAcross = 80 - statsWidth
var charsDown = 25

var canvasWidth = (charsAcross + statsWidth) * charWidthPixels
var canvasHeight = charsDown * charHeightPixels

;[
  statsCanvas,
  logCanvas,
  colorCanvas,
  visibleCanvas,
  levelCanvas,
  seenCanvas,
  objectCanvas,
  debugCanvas,
].forEach((el) => {
  el.width = canvasWidth
  el.height = canvasHeight
  el.style.transform = `translate(${canvasWidth / 2}px,${
    canvasHeight / 2
  }px)scale(2)`
})


// Dungeon with multiple levels
var dungeonLevels = []
var levelMap = generateLevel(mapWidth, mapHeight, { down: true })
dungeonLevels[0] = levelMap
var currentLevel = 0

function carveRoom(room, level) {
  for (var i = room.y; i < room.y + room.h; i++) {
    for (var j = room.x; j < room.x + room.w; j++) {
      level[i][j] = '.'
    }
  }
}

function createTileMap(levelMap) {
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

  levelMap.rooms.forEach((room) => {
    carveRoom(room, tileMap)
  })
  levelMap.corridors.forEach((room) => {
    carveRoom(room, tileMap)
  })

  if (levelMap.up) {
    tileMap[levelMap.up.y][levelMap.up.x] = '<'
  }
  if (levelMap.down) {
    tileMap[levelMap.down.y][levelMap.down.x] = '>'
  }

  return tileMap
}

var tileMap = createTileMap(dungeonLevels[currentLevel])

levelMap.wasVisible = tileMap.map((row) => row.map(() => false))
levelMap.isOccupied = tileMap.map((row) => row.map((tile) => tile == '#'))

var tileColors = {
  '#': '#666',
  '.': '#ddd',
  '<': '#ddd',
  '>': '#ddd',
}

var statsContext = statsCanvas.getContext('2d')
var logContext = logCanvas.getContext('2d')
var colorContext = colorCanvas.getContext('2d')
var visibleContext = visibleCanvas.getContext('2d')
var levelContext = levelCanvas.getContext('2d')
var seenContext = seenCanvas.getContext('2d')
var objectContext = objectCanvas.getContext('2d')
var debugContext = debugCanvas.getContext('2d')

var lastTs = 0
var dt
var dtUpdate = 0
var fps = 0

// Initial player stats
var startPos = getRandomRoomPosition(dungeonLevels[currentLevel])
var player = {
  x: startPos.x,
  y: startPos.y,
  hp: 10,
  hitChance: 0.5,
  visRadius: 7.5,
  attacking: false,
}

levelMap.isOccupied[player.y][player.x] = true

// Monsters
var nMonsters = 5
var monsters = []
for (var iMonster = 0; iMonster < nMonsters; iMonster++) {
  var pos = getRandomRoomPosition(dungeonLevels[currentLevel])
  while (levelMap.isOccupied[pos.y][pos.x]) {
    pos = getRandomRoomPosition(dungeonLevels[currentLevel])
  }
  monsters.push({
    x: pos.x,
    y: pos.y,
    hp: randInt(1, 5),
    hitChance: 0.3,
    seen: false,
    aggressive: false,
  })
  levelMap.isOccupied[pos.y][pos.x] = true
}

// Log
var logBuffer = ['> Welcome!']

var initSeen = true

// Should redraw
var redrawStats = true
var redrawLog = true
var redrawLevel = true
var redrawSeen = true
var redrawObjects = true

function drawChar(ctx, charsImg, char, i, j) {
  if (!(char in charMap)) {
    throw new Error('invalid char: ' + char)
  }
  ctx.drawImage(
    charsImg,
    charOffsetX + charMap[char].j * charWidthPixels,
    charOffsetY + charMap[char].i * charHeightPixels,
    charWidthPixels,
    charHeightPixels,
    j * charWidthPixels,
    i * charHeightPixels,
    charWidthPixels,
    charHeightPixels
  )
}

function drawCharOpaque(ctx, char, i, j) {
  drawChar(ctx, charsImgOpaque, char, i, j)
}

function drawCharAlpha(ctx, char, i, j) {
  drawChar(ctx, charsImgAlpha, char, i, j)
}

function drawText(ctx, text, i, j) {
  var k
  // console.log('drawing text ' + text)
  for (k = 0; k < text.length; k++) {
    drawCharOpaque(ctx, text[k], i, j + k)
  }
}

function drawTile(ctx, color, i, j) {
  ctx.fillStyle = color
  ctx.fillRect(j * charWidthPixels, i * charHeightPixels, charWidthPixels, charHeightPixels)
}

function clearTile(ctx, i, j) {
  ctx.clearRect(j * charWidthPixels, i * charHeightPixels, charWidthPixels, charHeightPixels)
}

var visBlock = {
  '#': 0.05,
  '.': 0.45,
  '<': 0.45,
  '>': 0.45,
}

// Is (x,y) visible from (x0,y0) in tile map level
function isVisible(x, y, x0, y0, level) {
  var m, xj, yj, yj_, xj_, j, dj, vbj_d, vbj_u, vb_d, vb_u
  if (Math.abs(y - y0) <= Math.abs(x - x0)) {
    // "x-simple"
    m = (y - y0) / (x - x0)
    dj = x < x0 ? -1 : 1
    vb_d = 0
    vb_u = 0
    for (j = 0; Math.abs(j) < Math.abs(x - x0); j += dj) {
      xj = x0 + j
      yj = y0 + m * j

      yj_ = Math.floor(yj)

      // Calculate blocked portion of visiblity to both sides
      vbj_d = 1 - (yj - yj_)
      vbj_u = 1 - vbj_d

      if (level[yj_][xj] == '#' && vbj_d > vb_d) {
        vb_d = vbj_d
      }
      if (level[yj_ + 1][xj] == '#' && vbj_u > vb_u) {
        vb_u = vbj_u
      }
      if (vb_d + vb_u > 1 - visBlock[level[y][x]]) {
        return false
      }
    }
  } else {
    // "y-simple"
    m = (x - x0) / (y - y0)
    dj = y < y0 ? -1 : 1
    vb_d = 0
    vb_u = 0
    for (j = 0; Math.abs(j) < Math.abs(y - y0); j += dj) {
      yj = y0 + j
      xj = x0 + m * j

      xj_ = Math.floor(xj)

      vbj_d = 1 - (xj - xj_)
      vbj_u = 1 - vbj_d

      if (level[yj][xj_] == '#' && vbj_d > vb_d) {
        vb_d = vbj_d
      }
      if (level[yj][xj_ + 1] == '#' && vbj_u > vb_u) {
        vb_u = vbj_u
      }
      if (vb_d + vb_u > 1 - visBlock[level[y][x]]) {
        return false
      }
    }
  }
  return true
}

function gameLoop(ts) {
  dt = ts - lastTs
  lastTs = ts

  var i, j

  // Stats overlay
  if (redrawStats) {
    for (i = 0; i < statsHeight; i++) {
      for (j = 0; j < statsWidth; j++) {
        drawCharOpaque(statsContext, ' ', i, j + mapWidth)
      }
    }
    drawText(
      statsContext,
      `HP: ${player.hp.toString().padStart(3, ' ')}`,
      1,
      mapWidth + 1
    )
    redrawStats = false
  }

  if (redrawLog) {
    // TODO: There must be a better way...
    logContext.clearRect(0, 0, canvasWidth, canvasHeight)
    for (i = 0; i < logHeight; i++) {
      for (j = 0; j < logWidth; j++) {
        drawCharOpaque(logContext, ' ', i + mapHeight, j)
      }
    }
    var latestLines = []
    var iLog = 0
    while (latestLines.length <= logHeight && iLog < logBuffer.length) {
      var msg = logBuffer[iLog]
      var lineRegex = new RegExp(`(.{0,${logWidth}}$|.{0,${logWidth}}\\b)`, 'g')
      var lines = msg
        .match(lineRegex)
        .filter((line) => line)
        .map((line) => line.trim())
        .reverse()
      lines.forEach((line) => {
        latestLines.unshift(line)
      })
      iLog += 1
    }
    for (i = 0; i < Math.min(latestLines.length, logHeight); i++) {
      drawText(
        logContext,
        latestLines[latestLines.length - 1 - i],
        mapHeight + logHeight - 1 - i,
        0
      )
    }
    redrawLog = false
  }

  // Mostly static level map
  if (redrawLevel) {
    console.log('redrawing level')
    levelContext.clearRect(0, 0, canvasWidth, canvasHeight)

    for (i = 0; i < mapHeight; i++) {
      for (j = 0; j < mapWidth; j++) {
        var tile = tileMap[i][j]
        let tileColor = tileColors[tile]
        drawTile(colorContext, tileColor, i, j)
        drawCharAlpha(levelContext, tile, i, j)
      }
    }

    redrawLevel = false
  }

  if (initSeen) {
    seenContext.clearRect(0, 0, canvasWidth, canvasHeight)

    // Black except around player
    for (i = 0; i < mapHeight; i++) {
      for (j = 0; j < mapWidth; j++) {
        if (
          (i - player.y) ** 2 + (j - player.x) ** 2 > player.visRadius ** 2 ||
          !isVisible(j, i, player.x, player.y, tileMap)
        ) {
          drawCharOpaque(seenContext, ' ', i, j)
        }
      }
    }
    initSeen = false
  }

  if (redrawSeen) {
    for (i = 0; i < mapHeight; i++) {
      for (j = 0; j < mapWidth; j++) {
        var nonVisible = 'rgba(0, 0, 0, 0.2)'
        if (
          (i - player.y) ** 2 + (j - player.x) ** 2 < player.visRadius ** 2 &&
          isVisible(j, i, player.x, player.y, tileMap)
        ) {
          levelMap.wasVisible[i][j] = true
          // Remove "fog of war" once tile becomes visible for first time
          clearTile(seenContext, i, j)

          // Clear visibility range mask too
          clearTile(visibleContext, i, j)
        } else if (levelMap.wasVisible[i][j]) {
          levelMap.wasVisible[i][j] = false
          drawTile(visibleContext, nonVisible, i, j)
        }
      }
    }
    redrawSeen = false
  }

  // "Dynamic entities"
  if (redrawObjects) {
    // console.log('redrawing objects')

    objectContext.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw player (color rectangle and symbol)
    drawTile(objectContext, 'green', player.y, player.x)
    drawCharAlpha(objectContext, '@', player.y, player.x)

    // Draw monster if alive and in visibility range
    monsters.forEach((monster) => {
      if (
        monster.hp > 0 &&
        (monster.x - player.x) ** 2 + (monster.y - player.y) ** 2 <
          player.visRadius ** 2 &&
        isVisible(monster.x, monster.y, player.x, player.y, tileMap)
      ) {
        // Monster within visibility radius, interpret it so that sees that player
        monster.seen = true
        drawTile(objectContext, 'red', monster.y, monster.x)
        drawCharAlpha(objectContext, 'g', monster.y, monster.x)
      } else {
        monster.seen = false
      }
    })

    redrawObjects = false
  }

  // Debug overlays
  if (ts - dtUpdate > 500) {
    debugContext.clearRect(0, 0, canvasWidth, canvasHeight)

    fps = (1000 / dt).toFixed(1)
    dtUpdate = ts

    // FPS
    debugContext.font = '10px sans-serif'
    debugContext.fillStyle = 'red'
    debugContext.fillText('FPS ' + fps, 10, 20)
  }

  window.requestAnimationFrame(gameLoop)
}

var movementKeys = [85, 73, 79, 74, 75, 76, 77, 188, 190] // uiojklm,.
var keyDisplacement = {
  85: { dx: -1, dy: -1 },
  73: { dx: 0, dy: -1 },
  79: { dx: 1, dy: -1 },
  74: { dx: -1, dy: 0 },
  75: { dx: 0, dy: 0 },
  76: { dx: 1, dy: 0 },
  77: { dx: -1, dy: 1 },
  188: { dx: 0, dy: 1 },
  190: { dx: 1, dy: 1 },
}

function isAdjacent(o1, o2) {
  return Math.max(Math.abs(o1.x - o2.x), Math.abs(o1.y - o2.y)) == 1
}

function getApproachVectors(src, dest) {
  var dispX = dest.x - src.x
  var dispY = dest.y - src.y
  var dx0 = dispX != 0 ? (dispX < 0 ? -1 : 1) : 0
  var dy0 = dispY != 0 ? (dispY < 0 ? -1 : 1) : 0

  // Preferred approach direction
  var vectors = [
    {
      dx: dx0,
      dy: dy0,
    },
  ]

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

window.addEventListener('keyup', function (e) {
  var dx, dy
  var turnDone = false
  var logMsg = '>'
  var monster

  if (player.hp <= 0) {
    console.log('you are dead')
    // Press some key to restart?
    return
  }

  if (player.attacking) {
    if (movementKeys.includes(e.keyCode)) {
      /* eslint-disable-next-line no-extra-semi */
      ;({ dx, dy } = keyDisplacement[e.keyCode])
      // console.log('attacking: ' + dx + ', ' + dy)
      // Check if there is a monster where player is attacking
      monster = monsters.find(
        (m) => m.x == player.x + dx && m.y == player.y + dy && m.hp > 0
      )
      if (monster) {
        if (Math.random() < player.hitChance) {
          monster.hp -= 1
          logMsg += ' You hit the monster.'
          if (monster.hp == 0) {
            levelMap.isOccupied[monster.y][monster.x] = false
            logMsg += ' The monster is killed.'
          }
        } else {
          logMsg += ' You miss the monster.'
        }
      }
      player.attacking = false
      turnDone = true
    }
  } else {
    if (movementKeys.includes(e.keyCode)) {
      /* eslint-disable-next-line no-extra-semi */
      ;({ dx, dy } = keyDisplacement[e.keyCode])
      // console.log('moving: ' + dx + ', ' + dy)
      if (dx == 0 && dy == 0) {
        turnDone = true
      } else if (!levelMap.isOccupied[player.y + dy][player.x + dx]) {
        levelMap.isOccupied[player.y][player.x] = false
        player.x += dx
        player.y += dy
        levelMap.isOccupied[player.y][player.x] = true

        turnDone = true
        redrawSeen = true
      }
    } else {
      if (e.keyCode == 65 /* a */) {
        player.attacking = true
      } else if (e.keyCode == 83 /* s */) {
        // Use staircase
        if (tileMap[player.y][player.x] == '<') {
          // Up
        } else if (tileMap[player.y][player.x] == '>') {
          // Down
          /*
          if (currentLevel == dungeonLevels.length - 1) {
            // Bottom of currently generated levels, generate new one
            dungeonLevels.push(
              generateLevel(mapWidth, mapHeight, { up: true, down: true })
            )
            currentLevel += 1
          }
          */
        }
      } else {
        console.log('unknown command: ' + e.keyCode)
      }
    }
  }

  if (turnDone) {
    // Monsters move at random, if alive
    for (monster of monsters) {
      if (monster.hp > 0) {
        // Seen monsters have certain chance to become aggressive
        if (monster.seen && !monster.aggressive && Math.random() < 0.2) {
          console.log('monster becomes aggressive')
          monster.aggressive = true
        }

        if (monster.aggressive && monster.seen) {
          // Aggressive monsters move towards player if they are visible
          if (isAdjacent(monster, player)) {
            console.log('monster attacks')
            dx = 0
            dy = 0
            if (Math.random() < monster.hitChance) {
              logMsg += ' The monster hits you.'
              player.hp -= 1
              redrawStats = true
              if (player.hp <= 0) {
                logMsg += ' You die.'
                // Game stops here
                break
              }
            } else {
              logMsg += ' The monster misses you.'
            }
          } else {
            var vectors = getApproachVectors(monster, player)
            var vectorFound = false
            for (var v of vectors) {
              if (!levelMap.isOccupied[monster.y + v.dy][monster.x + v.dx]) {
                dx = v.dx
                dy = v.dy
                vectorFound = true
                break
              }
            }
            if (!vectorFound) {
              dx = 0
              dy = 0
            }
          }
        } else {
          var dirInd = Math.floor(9 * Math.random())
          var dir = movementKeys[dirInd]
          ;({ dx, dy } = keyDisplacement[dir])
          if (levelMap.isOccupied[monster.y + dy][monster.x + dx]) {
            dx = 0
            dy = 0
          }
        }
        levelMap.isOccupied[monster.y][monster.x] = false
        monster.x += dx
        monster.y += dy
        levelMap.isOccupied[monster.y][monster.x] = true
      }
    }

    redrawObjects = true
  }

  if (logMsg.length > 1) {
    logBuffer.unshift(logMsg)
    redrawLog = true
  }
})

window.requestAnimationFrame(gameLoop)
