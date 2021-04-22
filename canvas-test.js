var c1 = document.getElementById('c1')
var c2 = document.getElementById('c2')

;[c1, c2].forEach((el) => {
  el.width = 500
  el.height = 500
})

var ctx1 = c1.getContext('2d')
var ctx2 = c2.getContext('2d')

ctx1.fillStyle = 'rgba(255, 0, 0, 1)'
ctx1.fillRect(50, 50, 100, 100)

ctx1.fillStyle = 'rgba(0, 255, 0, 1)'
ctx1.fillRect(50, 175, 100, 100)

ctx1.fillStyle = 'rgba(0, 0, 255, 1)'
ctx1.fillRect(175, 50, 100, 100)

ctx2.fillStyle = 'rgba(200, 200, 200, 0.5)'
ctx2.fillRect(75, 75, 175, 175)
