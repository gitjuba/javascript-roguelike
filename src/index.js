var Logger = require('./logger')
var Renderer = require('./renderer')
var Level = require('./level')
var { Player } = require('./entities')

var GAME_VERSION = '0.0.2'

var {
  canvasWidthChars,
  canvasHeightChars,
  mapWidth,
  mapHeight,
  statsWidth,
  statsHeight,
  logWidth,
  logHeight
} = require('./layout')

var defaultTextColor = '#aaa'

function createCanvasContainer() {
  var div = document.createElement('div')
  div.className = 'container'
  document.body.appendChild(div)
  return div
}

var container = createCanvasContainer()

function createCharacterSheet(imageFile) {
  var img = document.createElement('img')
  img.src = imageFile
  img.className = 'character-sheet'
  img.onload = function() {
    splashScreen()
  }
  document.body.appendChild(img)
  return img
}

var charSheet = createCharacterSheet('Codepage-850_alpha.png')

var splashRenderer = new Renderer('splash', 0, 0, canvasWidthChars, canvasHeightChars).init(container, charSheet)

var statsRenderer = new Renderer('stats', 0,
  mapWidth, statsWidth, statsHeight).init(container, charSheet)

var logRenderer = new Renderer('log', mapHeight, 0, logWidth, logHeight).init(container, charSheet)

var colorRenderer = new Renderer('color', 0, 0, mapWidth, mapHeight).init(container, charSheet)
var visibleRenderer = new Renderer('visible', 0, 0, mapWidth, mapHeight).init(container, charSheet)
var levelRenderer = new Renderer('level', 0, 0, mapWidth, mapHeight).init(container, charSheet)
var objectRenderer = new Renderer('objects', 0, 0, mapWidth, mapHeight).init(container, charSheet)
var seenRenderer = new Renderer('seen', 0, 0, mapWidth, mapHeight).init(container, charSheet)
var debugRenderer = new Renderer('debug', 0, 0, mapWidth, mapHeight).init(container, charSheet)

var hofRenderer = new Renderer('hof', 0, 0, canvasWidthChars, canvasHeightChars).init(container, charSheet)

var movementKeys = 'uiojklm,.'
var keyDisplacement = {
  u: { dx: -1, dy: -1 },
  i: { dx: 0, dy: -1 },
  o: { dx: 1, dy: -1 },
  j: { dx: -1, dy: 0 },
  k: { dx: 0, dy: 0 },
  l: { dx: 1, dy: 0 },
  m: { dx: -1, dy: 1 },
  ',': { dx: 0, dy: 1 },
  '.': { dx: 1, dy: 1 }
}

class GameClass {
  constructor() {

  }

  resetRenderFlags() {}
}

function Game(gameOptions) {
  this.resetRenderFlags = function resetRenderFlags() {
    this.shouldRenderStats = true
    this.shouldRenderLog = true
    this.shouldRenderLevel = true
    this.shouldRenderObjects = true
    this.shouldRenderSeen = true
    this.shouldRenderVisible = true
  }
  this.resetRenderFlags()

  this.isFinished = false
  this.levels = []
  this.currentLevel = 0

  this.addNewLevel = function addNewLevel() {
    var newLevel = new Level(this.levels.length, { down: true, up: this.levels.length > 0 })
    this.levels.push(newLevel)
    return newLevel
  }
  this.isFirstLevel = function isFirstLevel() {
    return this.currentLevel == 0
  }
  this.isLatestLevel = function isLatestLevel() {
    return this.currentLevel == this.levels.length - 1
  }

  var logger = Logger.getInstance()
  logger.appendToLine(`Welcome, ${gameOptions.playerName}!`)
  logger.finishLine()

  this.addNewLevel()

  seenRenderer.fillWithChar(' ')

  this.player = new Player('@', 'green', gameOptions.playerName)
  var playerPosition = this.levels[this.currentLevel].getRandomUnoccupiedTile()
  this.player.setPosition(playerPosition)
  this.levels[this.currentLevel].placePlayer(this.player)

  this.getStatsLines = function getStatsLines() {
    return [
      this.player.name,
      'D  ' + String(this.currentLevel).padStart(5, ' '),
      'HP ' + String(this.player.hp).padStart(5, ' '),
      '$  ' + String(this.player.score).padStart(5, ' ')
    ]
  }

  this.isOnAutoPilot = false
  this.autoPilotEvent = undefined
  this.playerEnvironment =

  this.engageAutoPilot = function engageAutoPilot(key) {
    this.isOnAutoPilot = true
    this.autoPilotEvent = { key }
    this.autoPilotEnvironment
  }

  this.disengageAutoPilot = function disengageAutoPilot() {
    this.isOnAutoPilot = false
    this.autoPilotEvent = undefined
  }

  this.updateState = function updateState(event) {
    var dx, dy

    var key = event.key

    var level = this.levels[this.currentLevel]

    var playerTurnDone = false

    var logger = Logger.getInstance()
    this.shouldRenderLog = true

    if (this.player.hp <= 0) {
      this.shouldRenderLog = false
      return
    }

    if (movementKeys.includes(key)) {
      ({ dx, dy } = keyDisplacement[key])
      if (this.player.attacking) {
        var monster = level.getMonsterAt(this.player.x + dx, this.player.y + dy)
        if (monster) {
          var success = this.player.attack(monster)
          if (success) {
            logger.appendToLine(`You hit the ${monster.name}.`)
          } else {
            logger.appendToLine(`You miss the ${monster.name}.`)
          }
          if (monster.hp <= 0) {
            logger.appendToLine(`The ${monster.name} is killed.`)
            this.player.score += monster.pointValue
            this.shouldRenderStats = true
            level.unoccupy(monster)
          }
        }
        this.player.attacking = false
        this.shouldRenderObjects = true
        playerTurnDone = true
      } else if (this.player.startedAutoWalk) {
        console.log('auto-walk')
        this.engageAutoPilot(key)
        this.player.startedAutoWalk = false
      } else {
        if (dx == 0 && dy == 0) {
          playerTurnDone = true
          this.disengageAutoPilot()
        } else if (!level.isOccupied[this.player.y + dy][this.player.x + dx]) {
          if (this.isOnAutoPilot) {
            // check if surroundings of player change
          }
          level.unoccupy(this.player)
          this.player.x += dx
          this.player.y += dy
          level.placePlayer(this.player)
          this.shouldRenderSeen = true
          this.shouldRenderVisible = true
          playerTurnDone = true
        } else {
          // Moving against occupied space, turn not done
          this.disengageAutoPilot()
        }
        this.shouldRenderObjects = true
      }
    } else {
      switch (key) {
        case 'a':
          this.player.attacking = true
          break
        case 'g':
          this.player.startedAutoWalk = true
        case 's':
          if (level.isDownStaircaseAt(this.player)) {
            var newLevel
            if (this.isLatestLevel()) {
              newLevel = this.addNewLevel()
            } else {
              newLevel = this.levels[this.currentLevel + 1]
            }
            logger.appendToLine('You descend the staircase.')
            this.currentLevel += 1
            this.resetRenderFlags()
            this.player.setPosition(newLevel.getUpStaircasePosition())
            newLevel.placePlayer(this.player)
          } else if (level.isUpStaircaseAt(this.player)) {
            var newLevel = this.levels[this.currentLevel - 1]
            logger.appendToLine('You ascend the staircase.')
            this.currentLevel -= 1
            this.resetRenderFlags()
            this.player.setPosition(newLevel.getDownStaircasePosition())
            newLevel.placePlayer(this.player)
          }
          break
        default:
          console.log('unknown command: ' + key)
      }
    }

    if (playerTurnDone) {
      for (var iMonster = 0; iMonster < level.monsters.length; iMonster++) {
        var monster = level.monsters[iMonster]
        if (monster.hp > 0) {
          if (!monster.seen && level.isVisibleMask[monster.y][monster.x]) {
            monster.seen = true
          } else if (monster.seen && !level.isVisibleMask[monster.y][monster.x]) {
            monster.seen = false
          }
          if (monster.seen) {
            this.disengageAutoPilot()
          }
          monster.rollAggravation()
          if (monster.aggressive && monster.seen) {
            if (monster.isAdjacentTo(this.player)) {
              dx = 0
              dy = 0
              var success = monster.attack(this.player)
              if (success) {
                logger.appendToLine(`The ${monster.name} hits you.`)
                this.shouldRenderStats = true
              } else {
                logger.appendToLine(`The ${monster.name} misses you.`)
              }
              if (this.player.hp <= 0) {
                this.player.killedBy = `a ${monster.name}`
                logger.appendToLine('You die. Press Enter to continue...')
                this.isFinished = true
                break
              }
            } else {
              var vectors = monster.getApproachVectorsTo(this.player)
              var vectorFound = false
              for (var v of vectors) {
                if (!level.isOccupied[monster.y + v.dy][monster.x + v.dx]) {
                  dx = v.dx
                  dy = v.dy
                  vectorFound = true
                  break
                }
              }
              if (!vectorFound) {
                dx = 0
                dy = 0
              }
            }
          } else {
            var dirInd = Math.floor(9 * Math.random())
            var dir = movementKeys[dirInd]
            ;({ dx, dy } = keyDisplacement[dir])
            if (level.isOccupied[monster.y + dy][monster.x + dx]) {
              dx = 0
              dy = 0
            }
          }
          level.unoccupy(monster)
          monster.x += dx
          monster.y += dy
          level.occupy(monster)
        }
      }
    }
    logger.finishLine()
  }

  this.render = function render() {
    if (this.shouldRenderStats) {
      this.renderStats()
      this.shouldRenderStats = false
    }
    if (this.shouldRenderLog) {
      this.renderLog()
      this.shouldRenderLog = false
    }
    if (this.shouldRenderLevel) {
      this.renderLevel()
      this.shouldRenderLevel = false
    }
    if (this.shouldRenderObjects) {
      this.renderObjects()
      this.shouldRenderObjects = false
    }
    if (this.shouldRenderSeen) {
      this.renderSeen()
      this.shouldRenderSeen = false
    }
    if (this.shouldRenderVisible) {
      this.renderVisible()
      this.shouldRenderVisible = false
    }
  }

  this.renderStats = function renderStats() {
    statsRenderer.clear()
    var statsLines = this.getStatsLines()
    statsRenderer.drawText(''.padEnd(statsWidth, ' '), defaultTextColor, 0, 0)
    var iLine = 1
    for (var line of statsLines) {
      statsRenderer.drawText(line.padEnd(statsWidth, ' '), defaultTextColor, iLine, 0)
      iLine += 1
    }
    while (iLine < statsHeight) {
      statsRenderer.drawText(''.padEnd(statsWidth, ' '), defaultTextColor, iLine, 0)
      iLine += 1
    }
  }

  this.renderLog = function renderLog() {
    logRenderer.clear()
    var logger = Logger.getInstance()
    var logLines = logger.getLogLines()
    var iLine = 1
    for (var line of logLines) {
      logRenderer.drawText(line, defaultTextColor, -iLine, 0)
      iLine += 1
    }
  }

  this.renderLevel = function renderLevel() {
    levelRenderer.clear()
    var level = this.levels[this.currentLevel]
    for (var i = 0; i < mapHeight; i++) {
      for (var j = 0; j < mapWidth; j++) {
        var tile = level.tileMap.data[i][j]
        colorRenderer.drawTile(level.colorMap[tile], i, j)
        levelRenderer.drawChar(tile, i, j)
      }
    }
  }

  this.renderObjects = function renderObjects() {
    objectRenderer.clear()
    objectRenderer.drawColoredChar(this.player.char, this.player.color, this.player.y, this.player.x)

    var level = this.levels[this.currentLevel]
    for (var iMonster = 0; iMonster < level.monsters.length; iMonster++) {
      var monster = level.monsters[iMonster]
      if (monster.hp > 0 && level.isVisibleMask[monster.y][monster.x]) {
        objectRenderer.drawColoredChar(monster.char, monster.color, monster.y, monster.x)
      }
    }
  }

  this.renderSeen = function renderSeen() {
    var level = this.levels[this.currentLevel]
    for (var i = 0; i < mapHeight; i++) {
      for (var j = 0; j < mapWidth; j++) {
        if (level.seenMask[i][j]) {
          seenRenderer.clearTile(i, j)
        } else {
          seenRenderer.drawChar(' ', i, j)
        }
      }
    }
  }

  this.renderVisible = function renderVisible() {
    var level = this.levels[this.currentLevel]
    for (var i = 0; i < mapHeight; i++) {
      for (var j = 0; j < mapWidth; j++) {
        if (level.isVisibleMask[i][j]) {
          visibleRenderer.clearTile(i, j)
        } else if (level.becameNotVisible(i, j)) {
          visibleRenderer.drawTile('rgba(0, 0, 0, 0.2)', i, j)
        }
      }
    }
  }

  this.clear = function clear() {
    var logger = Logger.getInstance()
    logger.clearBuffer()

    statsRenderer.clear()
    logRenderer.clear()
    colorRenderer.clear()
    visibleRenderer.clear()
    levelRenderer.clear()
    objectRenderer.clear()
    seenRenderer.clear()
    debugRenderer.clear()
  }
}

var alphabet = 'abcdefghijklmnopqrstuvxyz'

function splashScreen() {
  var shouldRenderSplash = true
  var shouldRenderPlayerName = true
  var playerName = ''

  var splashAnimationHandle

  function renderSplashScreen() {
    if (shouldRenderSplash) {
      splashRenderer.fillWithChar(' ')
      splashRenderer.drawText('a roguelike game', defaultTextColor, 10, 5)
      splashRenderer.drawText('please enter your name: ', defaultTextColor, 12, 5)
      shouldRenderSplash = false
    }

    if (shouldRenderPlayerName) {
      splashRenderer.drawText(`${playerName}_`.padEnd(16, ' '), defaultTextColor, 12, 29)
      shouldRenderPlayerName = false
    }

    splashAnimationHandle = window.requestAnimationFrame(renderSplashScreen)
  }

  function handleNameInput(e) {
    if (alphabet.includes(e.key) && playerName.length < 15) {
      playerName += e.key
      shouldRenderPlayerName = true
    }
    if (e.key == 'Backspace') {
      playerName = playerName.slice(0, playerName.length - 1)
      shouldRenderPlayerName = true
    }
  }

  function handleSubmitName(e) {
    if (e.key == 'Enter' && playerName.length > 0) {
      window.removeEventListener('keydown', handleNameInput)
      window.removeEventListener('keyup', handleSubmitName)
      window.cancelAnimationFrame(splashAnimationHandle)
      splashRenderer.clear()
      startGame({
        playerName
      })
    }
  }

  window.addEventListener('keydown', handleNameInput)
  window.addEventListener('keyup', handleSubmitName)

  splashAnimationHandle = window.requestAnimationFrame(renderSplashScreen)
}

function startGame(gameOptions) {
  var gameAnimationHandle

  var game = new Game(gameOptions)

  function gameLoop() {
    if (game.isOnAutoPilot) {
      console.log('update state on auto pilot')
      game.updateState(game.autoPilotEvent)
      if (!game.isOnAutoPilot) {
        window.addEventListener('keyup', handleGameInput)
      }
    }
    game.render()
    gameAnimationHandle = window.requestAnimationFrame(gameLoop)
  }

  function handleGameInput(e) {
    game.updateState(e)
    if (game.isOnAutoPilot) {
      console.log('on auto pilot, remove event listener')
      window.removeEventListener('keyup', handleGameInput)
    }
    if (e.key == 'Enter' && game.isFinished) {
      window.removeEventListener('keyup', handleGameInput)
      game.clear()
      window.cancelAnimationFrame(gameAnimationHandle)

      hallOfFame({
        newEntry: {
          player: game.player.name,
          score: game.player.score,
          version: GAME_VERSION,
          date: new Date().toISOString().slice(0, 10),
          dungeonLevel: game.currentLevel,
          causeOfDeath: game.player.killedBy,
          isNewEntry: true
        }
      })
    }
  }

  window.addEventListener('keyup', handleGameInput)

  gameAnimationHandle = window.requestAnimationFrame(gameLoop)
}

function hallOfFame(hofOptions) {
  var shouldRenderHof = true
  var hofAnimationHandle

  var numHofEntries = 8
  var onlineRanking = -1
  var onlineHof = []

  var hofUrl = 'https://roguelike.wildfirecanvas.com/roguelike/hof'
  fetch(hofUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hofOptions.newEntry)
  }).then(res => res.json()).then(res => {
    onlineHof = res.hof
    onlineRanking = res.ranking
    shouldRenderHof = true
  }).catch(err => {
    console.log('error posting to HOF')
    console.error(err)
  })

  function renderHof() {
    if (shouldRenderHof) {
      hofRenderer.fillWithChar(' ')
      hofRenderer.drawText(`roguelike game version ${GAME_VERSION} high scores`, defaultTextColor, 1, 1)

      onlineHof
        .slice(0, numHofEntries)
        .forEach((entry, ind) => {
          hofRenderer.drawText(
            `${String(ind + 1).padStart(3, ' ')} ${entry.Player.padEnd(15, ' ')} ${String(entry.Score).padStart(5, ' ')} ${entry.Version}`,
            entry.isNewEntry ? '#bb5' : defaultTextColor,
            2 * ind + 4,
            1
          )
          hofRenderer.drawText(
            `killed by ${entry.CauseOfDeath} on level ${entry.DungeonLevel} on ${entry.Date}`,
            entry.isNewEntry ? '#773' : '#666',
            2 * ind + 5,
            5
          )
      })

      var congratsText = ''
      if (onlineRanking > -1 && onlineRanking <= numHofEntries) {
        congratsText += 'congrats on making it to the top ' + numHofEntries
      } else {
        congratsText += `your online ranking with score ${hofOptions.newEntry.score} is ${onlineRanking}`
      }
      hofRenderer.drawText(congratsText, defaultTextColor, 22, 1)
      hofRenderer.drawText('press enter to start a new game', defaultTextColor, 23, 1)

      shouldRenderHof = false
    }

    hofAnimationHandle = window.requestAnimationFrame(renderHof)
  }

  function handleEnterKey(e) {
    if (e.key == 'Enter') {
      window.cancelAnimationFrame(hofAnimationHandle)
      window.removeEventListener('keyup', handleEnterKey)
      hofRenderer.clear()
      splashScreen()
    }
  }

  window.addEventListener('keyup', handleEnterKey)

  hofAnimationHandle = window.requestAnimationFrame(renderHof)
}
