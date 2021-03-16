var statsCanvas = document.getElementById('stats')
var levelCanvas = document.getElementById('level')
var objectCanvas = document.getElementById('objects')
var debugCanvas = document.getElementById('debug')

// Code page 850 character sheet (Base64 encoded PNG file)
var charsImg = document.getElementById('chars')
var charWidth = 9
var charHeight = 14

var statsWidth = 10
var charsAcross = 80 - statsWidth
var charsDown = 24

var canvasWidth = (charsAcross + statsWidth) * charWidth
var canvasHeight = charsDown * charHeight

;[statsCanvas, levelCanvas, objectCanvas, debugCanvas].forEach((el) => {
  el.style.transform = `translate(${canvasWidth / 2}px,${
    canvasHeight / 2
  }px)scale(2)`
})

// Map char to location (row, column) in image
var charOffsetX = 4
var charOffsetY = 4
var charMap = {
  ' ': { i: 0, j: 0 },
  '#': { i: 1, j: 3 }, // 2nd row, 4th column
  '.': { i: 1, j: 14 },
  '@': { i: 2, j: 0 },
  g: { i: 3, j: 7 },
  H: { i: 2, j: 8 },
  P: { i: 2, j: 16 },
  ':': { i: 1, j: 26 },
  0: { i: 1, j: 16 },
  1: { i: 1, j: 17 },
}

// Initial single-screen map
var tileMap = [
  '#'.repeat(charsAcross),
  ...Array(charsDown - 2)
    .fill(0)
    .map(() => '#' + '.'.repeat(charsAcross - 2) + '#'),
  '#'.repeat(charsAcross),
].map((row) => row.split(''))

statsCanvas.width = canvasWidth
statsCanvas.height = canvasHeight
levelCanvas.width = canvasWidth
levelCanvas.height = canvasHeight
objectCanvas.width = canvasWidth
objectCanvas.height = canvasHeight
debugCanvas.width = canvasWidth
debugCanvas.height = canvasHeight

var ctxS = statsCanvas.getContext('2d')
var ctx0 = levelCanvas.getContext('2d')
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
var attacking = false

// Monster
var monsterX = 6
var monsterY = 3

// Should redraw
var redrawStats = true
var redrawLevel = true
var redrawObjects = true

function drawChar(ctx, char, i, j) {
  if (!(char in charMap)) {
    throw new Error('invalid char')
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

function drawText(ctx, text, i, j) {
  var k
  for (k = 0; k < text.length; k++) {
    drawChar(ctx, text[k], i, j + k)
  }
}

function gameLoop(ts) {
  dt = ts - lastTs
  lastTs = ts

  var i, j

  // Stats overlay
  if (redrawStats) {
    for (i = 0; i < charsDown; i++) {
      for (j = 0; j < statsWidth; j++) {
        drawChar(ctxS, ' ', i, j + charsAcross)
      }
    }
    drawText(
      ctxS,
      `HP: ${playerHp.toString().padStart(3, ' ')}`,
      1,
      charsAcross + 1
    )
    redrawStats = false
  }

  // Mostly static level map
  if (redrawLevel) {
    console.log('redrawing level')
    ctx0.clearRect(0, 0, canvasWidth, canvasHeight)

    for (i = 0; i < charsDown; i++) {
      for (j = 0; j < charsAcross; j++) {
        var tile = tileMap[i][j]
        if (tile in charMap) {
          drawChar(ctx0, tile, i, j)
        } else {
          throw new Error('invalid char')
        }
      }
    }

    redrawLevel = false
  }

  // "Dynamic entities"
  if (redrawObjects) {
    console.log('redrawing objects')

    ctx1.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw player
    drawChar(ctx1, '@', playerY, playerX)

    // Draw monster
    drawChar(ctx1, 'g', monsterY, monsterX)

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
  if (attacking) {
    if (arrowKeys.includes(e.keyCode)) {
      ;({ dx, dy } = getDisplacement(e.keyCode))
      console.log('attacking: ' + dx + ', ' + dy)
    }
  } else {
    if (arrowKeys.includes(e.keyCode)) {
      ;({ dx, dy } = getDisplacement(e.keyCode))
      console.log('moving: ' + dx + ', ' + dy)
      if (
        tileMap[playerY + dy][playerX + dx] == '.' &&
        !(monsterX == playerX + dx && monsterY == playerY + dy)
      ) {
        playerX += dx
        playerY += dy

        turnDone = true
      }
    }
  }

  if (turnDone) {
    // Monster moves at random
    var dir = 37 + Math.floor(Math.random() * 4)
    ;({ dx, dy } = getDisplacement(dir))
    if (
      tileMap[monsterY + dy][monsterX + dx] == '.' &&
      !(playerX == monsterX + dx && playerY == monsterY + dy)
    ) {
      monsterX += dx
      monsterY += dy
    }

    redrawObjects = true
  }
})

window.requestAnimationFrame(gameLoop)
