var statsCanvas = document.getElementById('stats')
var logCanvas = document.getElementById('log')
var colorCanvas = document.getElementById('color')
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
var tileMap = [
  '#'.repeat(mapWidth),
  ...Array(mapHeight - 2)
    .fill(0)
    .map(() => '#' + '.'.repeat(mapWidth - 2) + '#'),
  '#'.repeat(mapWidth),
].map((row) => row.split(''))

var ctxS = statsCanvas.getContext('2d')
var ctxL = logCanvas.getContext('2d')
var ctxC = colorCanvas.getContext('2d')
var ctx0 = levelCanvas.getContext('2d')
var ctxV = seenCanvas.getContext('2d')
var ctx1 = objectCanvas.getContext('2d')
var ctx2 = debugCanvas.getContext('2d')

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

function gameLoop(ts) {
  dt = ts - lastTs
  lastTs = ts

  var i, j

  // Stats overlay
  if (redrawStats) {
    for (i = 0; i < statsHeight; i++) {
      for (j = 0; j < statsWidth; j++) {
        drawCharOpaque(ctxS, ' ', i, j + mapWidth)
      }
    }
    drawText(
      ctxS,
      `HP: ${playerHp.toString().padStart(3, ' ')}`,
      1,
      mapWidth + 1
    )
    redrawStats = false
  }

  if (redrawLog) {
    ctxL.clearRect(0, 0, canvasWidth, canvasHeight)
    for (i = 0; i < logHeight; i++) {
      for (j = 0; j < logWidth; j++) {
        drawCharOpaque(ctxL, ' ', i + mapHeight, j)
      }
    }
    for (i = 0; i < Math.min(logBuffer.length, logHeight); i++) {
      drawText(ctxL, logBuffer[i], mapHeight + logHeight - 1 - i, 0)
    }
    redrawLog = false
  }

  // Mostly static level map
  if (redrawLevel) {
    console.log('redrawing level')
    ctx0.clearRect(0, 0, canvasWidth, canvasHeight)

    for (i = 0; i < mapHeight; i++) {
      for (j = 0; j < mapWidth; j++) {
        var tile = tileMap[i][j]
        drawCharAlpha(ctx0, tile, i, j)
      }
    }

    redrawLevel = false
  }

  if (initSeen) {
    ctxV.clearRect(0, 0, canvasWidth, canvasHeight)

    // Black except around player
    for (i = 0; i < mapHeight; i++) {
      for (j = 0; j < mapWidth; j++) {
        if ((i - playerY) ** 2 + (j - playerX) ** 2 > visRadius ** 2) {
          drawCharOpaque(ctxV, ' ', i, j)
        }
      }
    }
    initSeen = false
  }

  if (redrawSeen) {
    for (i = 0; i < mapHeight; i++) {
      for (j = 0; j < mapWidth; j++) {
        // Clear seen mask from around player, update visible circle
        if ((i - playerY) ** 2 + (j - playerX) ** 2 < visRadius ** 2) {
          ctxC.fillStyle = '#ffffff'
          ctxC.fillRect(j * charWidth, i * charHeight, charWidth, charHeight)
          ctxV.clearRect(j * charWidth, i * charHeight, charWidth, charHeight)
        } else {
          ctxC.fillStyle = '#aaaaaa'
          ctxC.fillRect(j * charWidth, i * charHeight, charWidth, charHeight)
        }
      }
    }
    redrawSeen = false
  }

  // "Dynamic entities"
  if (redrawObjects) {
    // console.log('redrawing objects')

    ctx1.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw player
    ctx1.fillStyle = 'green'
    ctx1.fillRect(
      playerX * charWidth,
      playerY * charHeight,
      charWidth,
      charHeight
    )
    drawCharAlpha(ctx1, '@', playerY, playerX)

    // Draw monster if alive and in visibility range
    if (
      monsterHp > 0 &&
      (monsterX - playerX) ** 2 + (monsterY - playerY) ** 2 < visRadius ** 2
    ) {
      ctx1.fillStyle = 'red'
      ctx1.fillRect(
        monsterX * charWidth,
        monsterY * charHeight,
        charWidth,
        charHeight
      )
      drawCharAlpha(ctx1, 'g', monsterY, monsterX)
    }

    redrawObjects = false
  }

  // Debug overlays
  if (ts - dtUpdate > 500) {
    ctx2.clearRect(0, 0, canvasWidth, canvasHeight)

    fps = (1000 / dt).toFixed(1)
    dtUpdate = ts

    // FPS
    ctx2.font = '10px sans-serif'
    ctx2.fillStyle = 'red'
    ctx2.fillText('FPS ' + fps, 10, 20)
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
      console.log('moving: ' + dx + ', ' + dy)
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
