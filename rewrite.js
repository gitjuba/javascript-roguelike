function Game() {
  this.updateState = function(event) { }
  this.render = function() {}
}

var game = new Game();

function gameLoop() {
  game.render()
  window.requestAnimationFrame(gameLoop)
}

window.addEventListener('keyup', function(e) {
  game.updateState(e)
})

window.requestAnimationFrame(gameLoop)
