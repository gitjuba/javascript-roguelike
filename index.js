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
var charWidth = 9
var charHeight = 14

// Screen divided to map, stats and log
var mapWidth = 70
var mapHeight = 20

var statsWidth = 10
var statsHeight = 20

var logWidth = 80
var logHeight = 5

var charsAcross = 80 - statsWidth
var charsDown = 25

var canvasWidth = (charsAcross + statsWidth) * charWidth
var canvasHeight = charsDown * charHeight

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

// Map char to location (row, column) in image
var charOffsetX = 4
var charOffsetY = 4
var charMap = {
  ' ': { i: 0, j: 0 },
  '!': { i: 1, j: 1 },
  '#': { i: 1, j: 3 }, // 2nd row, 4th column
  '.': { i: 1, j: 14 },
  0: { i: 1, j: 16 },
  1: { i: 1, j: 17 },
  ':': { i: 1, j: 26 },
  '>': { i: 1, j: 30 },
  '@': { i: 2, j: 0 },
  H: { i: 2, j: 8 },
  P: { i: 2, j: 16 },
  T: { i: 2, j: 20 },
  W: { i: 2, j: 23 },
  Y: { i: 2, j: 25 },
  c: { i: 3, j: 3 },
  d: { i: 3, j: 4 },
  e: { i: 3, j: 5 },
  g: { i: 3, j: 7 },
  h: { i: 3, j: 8 },
  i: { i: 3, j: 9 },
  k: { i: 3, j: 11 },
  l: { i: 3, j: 12 },
  m: { i: 3, j: 13 },
  n: { i: 3, j: 14 },
  o: { i: 3, j: 15 },
  r: { i: 3, j: 18 },
  s: { i: 3, j: 19 },
  t: { i: 3, j: 20 },
  u: { i: 3, j: 21 },
}

// Initial single-screen map
var tileMap = `
######################################################################
#......####################....#######################################
#......####################......#####################################
#......####################....#.#########.........###################
#......#########################.#########.........###################
#####.#########....................................###################
#####.#########.################.#########.........###################
#####.#########.################.#########.........###################
#####.#########.################.#########.........###################
###........####.################.#########.........###################
###........####.#####....#######.################.####################
###......................###..........###########.####################
###........##########....###..........###########.###########....#####
###........#################..........###########................#####
############################..........#######################....#####
############################..........#######################....#####
#############################################################....#####
######################################################################
######################################################################
######################################################################
`
  .trim()
  .split('\n')
  .map((row) => row.split(''))

var wasVisible = tileMap.map((row) => row.map(() => false))

var tileColors = {
  '#': '#666',
  '.': '#ddd',
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
var playerX = 3
var playerY = 3
var playerHp = 10
var hitChance = 0.5
var visRadius = 7.5
var attacking = false

// Monster
var monsterX = 6
var monsterY = 3
var monsterHp = 1

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
    charOffsetX + charMap[char].j * charWidth,
    charOffsetY + charMap[char].i * charHeight,
    charWidth,
    charHeight,
    j * charWidth,
    i * charHeight,
    charWidth,
    charHeight
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
  console.log('drawing text ' + text)
  for (k = 0; k < text.length; k++) {
    drawCharOpaque(ctx, text[k], i, j + k)
  }
}

function drawTile(ctx, color, i, j) {
  ctx.fillStyle = color
  ctx.fillRect(j * charWidth, i * charHeight, charWidth, charHeight)
}

function clearTile(ctx, i, j) {
  ctx.clearRect(j * charWidth, i * charHeight, charWidth, charHeight)
}

var visBlock = {
  '#': 0.05,
  '.': 0.45,
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
      `HP: ${playerHp.toString().padStart(3, ' ')}`,
      1,
      mapWidth + 1
    )
    redrawStats = false
  }

  if (redrawLog) {
    logContext.clearRect(0, 0, canvasWidth, canvasHeight)
    for (i = 0; i < logHeight; i++) {
      for (j = 0; j < logWidth; j++) {
        drawCharOpaque(logContext, ' ', i + mapHeight, j)
      }
    }
    for (i = 0; i < Math.min(logBuffer.length, logHeight); i++) {
      drawText(logContext, logBuffer[i], mapHeight + logHeight - 1 - i, 0)
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
          (i - playerY) ** 2 + (j - playerX) ** 2 > visRadius ** 2 ||
          !isVisible(j, i, playerX, playerY, tileMap)
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
          (i - playerY) ** 2 + (j - playerX) ** 2 < visRadius ** 2 &&
          isVisible(j, i, playerX, playerY, tileMap)
        ) {
          wasVisible[i][j] = true
          // Remove "fog of war" once tile becomes visible for first time
          clearTile(seenContext, i, j)

          // Clear visibility range mask too
          clearTile(visibleContext, i, j)
        } else if (wasVisible[i][j]) {
          wasVisible[i][j] = false
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
    drawTile(objectContext, 'green', playerY, playerX)
    drawCharAlpha(objectContext, '@', playerY, playerX)

    // Draw monster if alive and in visibility range
    if (
      monsterHp > 0 &&
      (monsterX - playerX) ** 2 + (monsterY - playerY) ** 2 < visRadius ** 2
    ) {
      drawTile(objectContext, 'red', monsterY, monsterX)
      drawCharAlpha(objectContext, 'g', monsterY, monsterX)
    }

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

var arrowKeys = [37, 38, 39, 40]

function getDisplacement(keyCode) {
  return {
    dx: keyCode - 38 < 2 ? keyCode - 38 : 0,
    dy: keyCode - 39 > -2 ? keyCode - 39 : 0,
  }
}

window.addEventListener('keyup', function (e) {
  var dx, dy
  var turnDone = false
  var logMsg = '>'
  if (attacking) {
    if (arrowKeys.includes(e.keyCode)) {
      ;({ dx, dy } = getDisplacement(e.keyCode))
      console.log('attacking: ' + dx + ', ' + dy)
      if (monsterX == playerX + dx && monsterY == playerY + dy) {
        if (Math.random() < hitChance) {
          monsterHp -= 1
          logMsg += ' You hit the monster.'
          if (monsterHp == 0) {
            logMsg += ' The monster is killed.'
          }
        } else {
          logMsg += ' You miss the monster.'
        }
      }
      attacking = false
      turnDone = true
    }
  } else {
    if (arrowKeys.includes(e.keyCode)) {
      ;({ dx, dy } = getDisplacement(e.keyCode))
      // console.log('moving: ' + dx + ', ' + dy)
      if (
        tileMap[playerY + dy][playerX + dx] == '.' &&
        (monsterHp == 0 ||
          !(monsterX == playerX + dx && monsterY == playerY + dy))
      ) {
        playerX += dx
        playerY += dy

        turnDone = true
        redrawSeen = true
      }
    } else {
      console.log(e.keyCode)
      if (e.keyCode == 65 /* a */) {
        attacking = true
      } else if (e.keyCode == 83 /* s */) {
        // Stand still
        turnDone = true
      }
    }
  }

  if (logMsg.length > 1) {
    logBuffer.unshift(logMsg)
    redrawLog = true
  }

  if (turnDone) {
    // Monster moves at random, if alive
    if (monsterHp > 0) {
      var dir = 37 + Math.floor(Math.random() * 4)
      ;({ dx, dy } = getDisplacement(dir))
      if (
        tileMap[monsterY + dy][monsterX + dx] == '.' &&
        !(playerX == monsterX + dx && playerY == monsterY + dy)
      ) {
        monsterX += dx
        monsterY += dy
      }
    }

    redrawObjects = true
  }
})

window.requestAnimationFrame(gameLoop)
