function randInt(n0, n1) {
  return n0 + Math.floor((n1 - n0 + 1) * Math.random())
}

function randFloat(f0, f1) {
  return f0 + Math.random() * (f1 - f0)
}

function tossACoin() {
  return Math.random() < 0.5
}

module.exports = {
  randInt,
  randFloat
}
