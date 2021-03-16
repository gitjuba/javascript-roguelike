var levelCanvas = document.getElementById('level')
var objectCanvas = document.getElementById('objects')
var overlayCanvas = document.getElementById('overlay')

// Code page 850 character sheet (Base64 encoded PNG file)
var charsImg = document.getElementById('chars')
var charWidth = 9
var charHeight = 14

var charsAcross = 80
var charsDown = 24

var canvasWidth = charsAcross * charWidth
var canvasHeight = charsDown * charHeight

// levelCanvas.style.width = '700px'
;[levelCanvas, objectCanvas, overlayCanvas].forEach((el) => {
  el.style.transform = `translate(${canvasWidth / 2}px,${
    canvasHeight / 2
  }px)scale(2)`
})

// Map char to location (row, column) in image
var charOffsetX = 4
var charOffsetY = 4
var charMap = {
  '#': { i: 1, j: 3 }, // 2nd row, 4th column
  '.': { i: 1, j: 14 },
  '@': { i: 2, j: 0 },
}

// Initial single-screen map
var tileMap = [
  '#'.repeat(charsAcross),
  ...Array(charsDown - 2)
    .fill(0)
    .map(() => '#' + '.'.repeat(charsAcross - 2) + '#'),
  '#'.repeat(charsAcross),
].map((row) => row.split(''))

levelCanvas.width = canvasWidth
levelCanvas.height = canvasHeight
objectCanvas.width = canvasWidth
objectCanvas.height = canvasHeight
overlayCanvas.width = canvasWidth
overlayCanvas.height = canvasHeight

var ctx0 = levelCanvas.getContext('2d')
var ctx1 = objectCanvas.getContext('2d')
var ctx2 = overlayCanvas.getContext('2d')

var lastTs = 0
var dt
var dtUpdate = 0
var fps = 0

// Initial player position
var playerX = 3
var playerY = 3

// Should redraw
var redrawLevel = true
var redrawObjects = true

function gameLoop(ts) {
  dt = ts - lastTs
  lastTs = ts

  // Mostly static level map
  if (redrawLevel) {
    console.log('redrawing level')
    ctx0.fillStyle = 'white'
    ctx0.fillRect(0, 0, canvasWidth, canvasHeight)

    var i, j
    for (i = 0; i < charsDown; i++) {
      for (j = 0; j < charsAcross; j++) {
        var tile = tileMap[i][j]
        if (tile in charMap) {
          ctx0.drawImage(
            charsImg,
            charOffsetX + charMap[tile].j * charWidth,
            charOffsetY + charMap[tile].i * charHeight,
            charWidth,
            charHeight,
            j * charWidth,
            i * charHeight,
            charWidth,
            charHeight
          )
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
    ctx1.drawImage(
      charsImg,
      charOffsetX + charMap['@'].j * charWidth,
      charOffsetY + charMap['@'].i * charHeight,
      charWidth,
      charHeight,
      playerX * charWidth,
      playerY * charHeight,
      charWidth,
      charHeight
    )

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

window.addEventListener('keyup', function (e) {
  if (e.keyCode == 37) {
    // left
    if (tileMap[playerY][playerX - 1] == '.') {
      playerX -= 1
      redrawObjects = true
    }
  }
  if (e.keyCode == 38) {
    // up
    if (tileMap[playerY - 1][playerX] == '.') {
      playerY -= 1
      redrawObjects = true
    }
  }
  if (e.keyCode == 39) {
    // right
    if (tileMap[playerY][playerX + 1] == '.') {
      playerX += 1
      redrawObjects = true
    }
  }
  if (e.keyCode == 40) {
    // down
    if (tileMap[playerY + 1][playerX] == '.') {
      playerY += 1
      redrawObjects = true
    }
  }
})

window.requestAnimationFrame(gameLoop)
