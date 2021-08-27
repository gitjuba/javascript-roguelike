function randInt(n0, n1) {
  return n0 + Math.floor((n1 - n0 + 1) * Math.random())
}

function tossACoin() {
  return Math.random() < 0.5
}

module.exports = {
  randInt
}
