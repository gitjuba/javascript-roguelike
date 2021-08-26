var {
  logWidth,
  logHeight
} = require('./layout')

// "singleton"
function Logger() {
  if (Logger.instance) {
    throw new Error('Use Logger.getInstance')
  }
  Logger.instance = this
  this.logBuffer = [
    'Welcome!',
    'Very long line with monsters attacking and all sorts of crazy stuff going on so that this has to be split into multiple lines for sure'
  ]
  this.maxLineWidth = logWidth - 2 // '> ' prefix
  this.lineRegex = new RegExp(`(.{0,${this.maxLineWidth}}$|.{0,${this.maxLineWidth}}\\b)`, 'g')

  this.newLine = ''
  this.appendToLine = function appendToLine(msg) {
    if (this.newLine.length == 0) {
      this.newLine += msg
    } else {
      this.newLine += (' ' + msg)
    }
  }
  this.finishLine = function finishLine() {
    if (this.newLine.length > 0) {
      this.logBuffer.unshift(this.newLine)
    }
    this.newLine = ''
  }

  this.getLogLines = function* getLogLines() {
    var linesToDisplay = []
    var iLine = 0
    while (linesToDisplay.length < logHeight) {
      if (iLine < this.logBuffer.length) {
        var line = this.logBuffer[iLine]
        var split = line.match(this.lineRegex)
          .map(part => part.trim())
          .filter(part => part.length > 0)
        for (var iPart = split.length - 1; iPart > 0; iPart--) {
          var part = '  ' + split[iPart]
          linesToDisplay.push(part)
        }
        var firstPart = '> ' + split[0]
        linesToDisplay.push(firstPart)
      } else {
        linesToDisplay.push('  ')
      }
      iLine += 1
    }
    iLine = 0
    while (iLine < logHeight) {
      var line = linesToDisplay[iLine]
      yield line.padEnd(logWidth, ' ')
      iLine += 1
    }
  }
}
Logger.getInstance = function getInstance() {
  return Logger.instance || new Logger()
}

module.exports = Logger
