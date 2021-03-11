var levelCanvas = document.getElementById('level')
var objectCanvas = document.getElementById('objects')
var overlayCanvas = document.getElementById('overlay')

var canvasWidth = 1280
var canvasHeight = 720

var tileSize = 40

var tilesAcross = canvasWidth / tileSize
var tilesDown = canvasHeight / tileSize

// Initial single-screen map
var tileMap = [
  '#'.repeat(tilesAcross),
  ...Array(tilesDown - 2)
    .fill(0)
    .map(() => '#' + '.'.repeat(tilesAcross - 2) + '#'),
  '#'.repeat(tilesAcross),
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
    for (i = 0; i < tilesDown; i++) {
      for (j = 0; j < tilesAcross; j++) {
        var tile = tileMap[i][j]
        var color = 'white'
        if (tile == '#') {
          color = 'black'
        }
        ctx0.fillStyle = color
        ctx0.fillRect(j * tileSize, i * tileSize, tileSize, tileSize)
        ctx0.strokeStyle = 'lightgrey'
        ctx0.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize)
      }
    }

    redrawLevel = false
  }

  // "Dynamic entities"
  if (redrawObjects) {
    console.log('redrawing objects')

    ctx1.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw player
    ctx1.fillStyle = 'blue'
    ctx1.fillRect(playerX * tileSize, playerY * tileSize, tileSize, tileSize)

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
