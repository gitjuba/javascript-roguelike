var canvas = document.getElementById('main')

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

canvas.width = canvasWidth
canvas.height = canvasHeight

var ctx = canvas.getContext('2d')

var lastTs = 0
var dt
var dtUpdate = 0
var fps = 0

// Initial player position
var playerX = 3
var playerY = 3

function gameLoop(ts) {
  dt = ts - lastTs
  lastTs = ts

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Draw tile map
  var i, j
  for (i = 0; i < tilesDown; i++) {
    for (j = 0; j < tilesAcross; j++) {
      var tile = tileMap[i][j]
      var color = 'white'
      if (tile == '#') {
        color = 'black'
      }
      ctx.fillStyle = color
      ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize)
      ctx.strokeStyle = 'lightgrey'
      ctx.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize)
    }
  }

  // Draw player
  ctx.fillStyle = 'blue'
  ctx.fillRect(playerX * tileSize, playerY * tileSize, tileSize, tileSize)

  // Debug overlays
  if (ts - dtUpdate > 500) {
    fps = (1000 / dt).toFixed(1)
    dtUpdate = ts
  }
  ctx.font = '10px sans-serif'
  ctx.fillStyle = 'red'
  ctx.fillText('FPS ' + fps, 10, 20)

  window.requestAnimationFrame(gameLoop)
}

window.addEventListener('keyup', function (e) {
  if (e.keyCode == 37) {
    // left
    if (tileMap[playerX - 1][playerY]) {
    }
  }
  if (e.keyCode == 38) {
    // up
  }
  if (e.keyCode == 39) {
    // right
  }
  if (e.keyCode == 40) {
    // down
  }
})

window.requestAnimationFrame(gameLoop)
