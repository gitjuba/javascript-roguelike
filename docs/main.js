/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/charmap.js":
/*!************************!*\
  !*** ./src/charmap.js ***!
  \************************/
/***/ ((module) => {

eval("var charWidthPixels = 9\nvar charHeightPixels = 14\n\n// Map char to location (row, column) in image\nvar charOffsetX = 4\nvar charOffsetY = 4\nvar charMap = {\n  ' ': { i: 0, j: 0 },\n  '!': { i: 1, j: 1 },\n  '\"': { i: 1, j: 2 },\n  '#': { i: 1, j: 3 }, // 2nd row, 4th column\n  $: { i: 1, j: 4 },\n  '%': { i: 1, j: 5 },\n  '&': { i: 1, j: 6 },\n  '(': { i: 1, j: 8 },\n  ')': { i: 1, j: 9 },\n  '*': { i: 1, j: 10 },\n  '+': { i: 1, j: 11 },\n  ',': { i: 1, j: 12 },\n  '-': { i: 1, j: 13 },\n  '.': { i: 1, j: 14 },\n  '/': { i: 1, j: 15 },\n  0: { i: 1, j: 16 },\n  1: { i: 1, j: 17 },\n  2: { i: 1, j: 18 },\n  3: { i: 1, j: 19 },\n  4: { i: 1, j: 20 },\n  5: { i: 1, j: 21 },\n  6: { i: 1, j: 22 },\n  7: { i: 1, j: 23 },\n  8: { i: 1, j: 24 },\n  9: { i: 1, j: 25 },\n  ':': { i: 1, j: 26 },\n  ';': { i: 1, j: 27 },\n  '<': { i: 1, j: 28 },\n  '=': { i: 1, j: 29 },\n  '>': { i: 1, j: 30 },\n  '?': { i: 1, j: 31 },\n  '@': { i: 2, j: 0 },\n  A: { i: 2, j: 1 },\n  B: { i: 2, j: 2 },\n  C: { i: 2, j: 3 },\n  D: { i: 2, j: 4 },\n  E: { i: 2, j: 5 },\n  F: { i: 2, j: 6 },\n  G: { i: 2, j: 7 },\n  H: { i: 2, j: 8 },\n  I: { i: 2, j: 9 },\n  J: { i: 2, j: 10 },\n  K: { i: 2, j: 11 },\n  L: { i: 2, j: 12 },\n  M: { i: 2, j: 13 },\n  N: { i: 2, j: 14 },\n  O: { i: 2, j: 15 },\n  P: { i: 2, j: 16 },\n  Q: { i: 2, j: 17 },\n  R: { i: 2, j: 18 },\n  S: { i: 2, j: 19 },\n  T: { i: 2, j: 20 },\n  U: { i: 2, j: 21 },\n  V: { i: 2, j: 22 },\n  W: { i: 2, j: 23 },\n  X: { i: 2, j: 24 },\n  Y: { i: 2, j: 25 },\n  Z: { i: 2, j: 26 },\n  a: { i: 3, j: 1 },\n  b: { i: 3, j: 2 },\n  c: { i: 3, j: 3 },\n  d: { i: 3, j: 4 },\n  e: { i: 3, j: 5 },\n  f: { i: 3, j: 6 },\n  g: { i: 3, j: 7 },\n  h: { i: 3, j: 8 },\n  i: { i: 3, j: 9 },\n  j: { i: 3, j: 10 },\n  k: { i: 3, j: 11 },\n  l: { i: 3, j: 12 },\n  m: { i: 3, j: 13 },\n  n: { i: 3, j: 14 },\n  o: { i: 3, j: 15 },\n  p: { i: 3, j: 16 },\n  q: { i: 3, j: 17 },\n  r: { i: 3, j: 18 },\n  s: { i: 3, j: 19 },\n  t: { i: 3, j: 20 },\n  u: { i: 3, j: 21 },\n  v: { i: 3, j: 22 },\n  w: { i: 3, j: 23 },\n  x: { i: 3, j: 24 },\n  y: { i: 3, j: 25 },\n  z: { i: 3, j: 26 },\n}\n\nmodule.exports = {\n  charWidthPixels,\n  charHeightPixels,\n  charOffsetX,\n  charOffsetY,\n  charMap\n}\n\n\n//# sourceURL=webpack://javascript-roguelike/./src/charmap.js?");

/***/ }),

/***/ "./src/entities.js":
/*!*************************!*\
  !*** ./src/entities.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var { randInt } = __webpack_require__(/*! ./map-generator */ \"./src/map-generator.js\")\n\nfunction LivingEntity(char, color) {\n  this.char = char\n  this.color = color\n  this.x = 0\n  this.y = 0\n\n  this.hp = 0\n  this.hitChance = 0\n  this.hitDamage = 0\n\n  this.setPosition = function(position) {\n    this.x = position.x\n    this.y = position.y\n  }\n\n  this.isAdjacentTo = function(that) {\n    return Math.max(Math.abs(this.x - that.x), Math.abs(this.y - that.y)) == 1\n  }\n\n  this.attack = function(that) {\n    if (Math.random() < this.hitChance) {\n      that.hp -= this.hitDamage\n      return true\n    } else {\n      return false\n    }\n  }\n\n  this.getApproachVectorsTo = function(that) {\n    var dispX = that.x - this.x\n    var dispY = that.y - this.y\n    var dx0 = dispX != 0 ? (dispX < 0 ? -1 : 1) : 0\n    var dy0 = dispY != 0 ? (dispY < 0 ? -1 : 1) : 0\n\n    var vectors = [{ dx: dx0, dy: dy0 }]\n\n    // If preferred direction along cardinal axis try also both diagonals around it\n    if (dx0 == 0) {\n      vectors.push({ dx: -1, dy: dy0 })\n      vectors.push({ dx: 1, dy: dy0 })\n    } else if (dy0 == 0) {\n      vectors.push({ dx: dx0, dy: -1 })\n      vectors.push({ dx: dx0, dy: 1 })\n    } else {\n      // Preferred direction is diagonal: try also both cardinal directions around it\n      vectors.push({ dx: 0, dy: dy0 })\n      vectors.push({ dx: dx0, dy: 0 })\n    }\n\n    return vectors\n  }\n}\n\nfunction Monster(char, color) {\n  LivingEntity.call(this, char, color)\n\n  this.seen = false\n  this.aggressive = false\n  this.aggravationChance = 0.2\n\n  this.rollAggravation = function() {\n    if (this.seen && !this.aggressive && Math.random() < this.aggravationChance) {\n      console.log('monster becomes agressive')\n      this.aggressive = true\n    }\n  }\n}\nMonster.fromSpawner = function(spawner) {\n  var monster = new Monster(spawner.char, spawner.color)\n  monster.name = spawner.name\n  monster.hp = spawner.hp()\n  monster.hitChance = spawner.hitChance()\n  monster.hitDamage = spawner.hitDamage()\n  return monster\n}\n\nfunction Player(char, color) {\n  LivingEntity.call(this, char, color)\n\n  this.hp = 10\n  this.hitChance = 0.5\n  this.hitDamage = 2\n\n  this.visRadius = 7.5\n  this.attacking = false\n\n  this.isWithinVisRadius = function(i, j) {\n    return (this.x - j) ** 2 + (this.y - i) ** 2 < this.visRadius ** 2\n  }\n}\n\nmodule.exports = {\n  Monster,\n  Player\n}\n\n\n//# sourceURL=webpack://javascript-roguelike/./src/entities.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("var Logger = __webpack_require__(/*! ./logger */ \"./src/logger.js\")\nvar Renderer = __webpack_require__(/*! ./renderer */ \"./src/renderer.js\")\nvar Level = __webpack_require__(/*! ./level */ \"./src/level.js\")\nvar { Player } = __webpack_require__(/*! ./entities */ \"./src/entities.js\")\n\nvar {\n  mapWidth,\n  mapHeight,\n  statsWidth,\n  statsHeight,\n  logWidth,\n  logHeight\n} = __webpack_require__(/*! ./layout */ \"./src/layout.js\")\n\nvar defaultTextColor = '#aaa'\n\nfunction createCanvasContainer() {\n  var div = document.createElement('div')\n  div.className = 'container'\n  document.body.appendChild(div)\n  return div\n}\n\nvar container = createCanvasContainer()\n\nfunction createCharacterSheet(imageFile) {\n  var img = document.createElement('img')\n  img.src = imageFile\n  img.className = 'character-sheet'\n  img.onload = function() {\n    console.log('image loaded')\n    startGame()\n  }\n  document.body.appendChild(img)\n  return img\n}\n\nvar charSheet = createCharacterSheet('Codepage-850_alpha.png')\n\nvar statsRenderer = new Renderer('stats', 0,\n  mapWidth, statsWidth, statsHeight).init(container, charSheet)\n\nvar logRenderer = new Renderer('log', mapHeight, 0, logWidth, logHeight).init(container, charSheet)\n\nvar colorRenderer = new Renderer('color', 0, 0, mapWidth, mapHeight).init(container, charSheet)\nvar visibleRenderer = new Renderer('visible', 0, 0, mapWidth, mapHeight).init(container, charSheet)\nvar levelRenderer = new Renderer('level', 0, 0, mapWidth, mapHeight).init(container, charSheet)\nvar objectRenderer = new Renderer('objects', 0, 0, mapWidth, mapHeight).init(container, charSheet)\nvar seenRenderer = new Renderer('seen', 0, 0, mapWidth, mapHeight).init(container, charSheet)\nvar debugRenderer = new Renderer('debug', 0, 0, mapWidth, mapHeight).init(container, charSheet)\n\nvar movementKeys = 'uiojklm,.'\nvar keyDisplacement = {\n  u: { dx: -1, dy: -1 },\n  i: { dx: 0, dy: -1 },\n  o: { dx: 1, dy: -1 },\n  j: { dx: -1, dy: 0 },\n  k: { dx: 0, dy: 0 },\n  l: { dx: 1, dy: 0 },\n  m: { dx: -1, dy: 1 },\n  ',': { dx: 0, dy: 1 },\n  '.': { dx: 1, dy: 1 }\n}\n\nfunction Game() {\n  this.resetRenderFlags = function() {\n    this.shouldRenderStats = true\n    this.shouldRenderLog = true\n    this.shouldRenderLevel = true\n    this.shouldRenderObjects = true\n    this.shouldRenderSeen = true\n    this.shouldRenderVisible = true\n  }\n  this.resetRenderFlags()\n\n  this.levels = []\n  this.currentLevel = 0\n\n  this.addNewLevel = function() {\n    var newLevel = new Level(this.levels.length, { down: true, up: this.levels.length > 0 })\n    this.levels.push(newLevel)\n    return newLevel\n  }\n  this.isFirstLevel = function() {\n    return this.currentLevel == 0\n  }\n  this.isLatestLevel = function() {\n    return this.currentLevel == this.levels.length - 1\n  }\n\n  this.addNewLevel()\n\n  seenRenderer.fillWithChar(' ')\n\n  this.player = new Player('@', 'green')\n  var playerPosition = this.levels[this.currentLevel].getRandomUnoccupiedTile()\n  this.player.setPosition(playerPosition)\n  this.levels[this.currentLevel].placePlayer(this.player)\n\n  this.getStatsLines = function() {\n    return [\n      'D  ' + String(this.currentLevel).padStart(5, ' '),\n      'HP ' + String(this.player.hp).padStart(5, ' ')\n    ]\n  }\n\n  this.updateState = function(event) {\n    var dx, dy\n\n    var key = event.key\n\n    var level = this.levels[this.currentLevel]\n\n    var playerTurnDone = false\n\n    var logger = Logger.getInstance()\n    // console.log(logger)\n    this.shouldRenderLog = true\n\n    if (this.player.hp <= 0) {\n      logger.appendToLine('You are dead. Refresh page to try again.')\n      logger.finishLine()\n      return\n    }\n\n    if (movementKeys.includes(key)) {\n      ({ dx, dy } = keyDisplacement[key])\n      if (this.player.attacking) {\n        var monster = level.getMonsterAt(this.player.x + dx, this.player.y + dy)\n        if (monster) {\n          var success = this.player.attack(monster)\n          if (success) {\n            logger.appendToLine(`You hit the ${monster.name}.`)\n          } else {\n            logger.appendToLine(`You miss the ${monster.name}.`)\n          }\n          if (monster.hp <= 0) {\n            logger.appendToLine(`The ${monster.name} is killed.`)\n            level.unoccupy(monster)\n          }\n        }\n        this.player.attacking = false\n        this.shouldRenderObjects = true\n        playerTurnDone = true\n      } else {\n        if (dx == 0 && dy == 0) {\n          playerTurnDone = true\n        } else if (!level.isOccupied[this.player.y + dy][this.player.x + dx]) {\n          level.unoccupy(this.player)\n          this.player.x += dx\n          this.player.y += dy\n          level.placePlayer(this.player)\n          this.shouldRenderSeen = true\n          this.shouldRenderVisible = true\n          playerTurnDone = true\n        } else {\n          // Moving against occupied space, turn not done\n        }\n        this.shouldRenderObjects = true\n      }\n    } else {\n      switch (key) {\n        case 'a':\n          console.log('attack')\n          this.player.attacking = true\n          break\n        case 's':\n          console.log('use stairs')\n          if (level.isDownStaircaseAt(this.player)) {\n            var newLevel\n            if (this.isLatestLevel()) {\n              newLevel = this.addNewLevel()\n            } else {\n              newLevel = this.levels[this.currentLevel + 1]\n            }\n            logger.appendToLine('You descend the staircase.')\n            this.currentLevel += 1\n            this.resetRenderFlags()\n            this.player.setPosition(newLevel.getUpStaircasePosition())\n            newLevel.placePlayer(this.player)\n          } else if (level.isUpStaircaseAt(this.player)) {\n            var newLevel = this.levels[this.currentLevel - 1]\n            logger.appendToLine('You ascend the staircase.')\n            this.currentLevel -= 1\n            this.resetRenderFlags()\n            this.player.setPosition(newLevel.getDownStaircasePosition())\n            newLevel.placePlayer(this.player)\n          }\n          break\n        default:\n          console.log('unknown command: ' + key)\n      }\n    }\n\n    if (playerTurnDone) {\n      for (var iMonster = 0; iMonster < level.monsters.length; iMonster++) {\n        var monster = level.monsters[iMonster]\n        if (monster.hp > 0) {\n          if (!monster.seen && level.isVisibleMask[monster.y][monster.x]) {\n            monster.seen = true\n          } else if (monster.seen && !level.isVisibleMask[monster.y][monster.x]) {\n            monster.seen = false\n          }\n          monster.rollAggravation()\n          if (monster.aggressive && monster.seen) {\n            if (monster.isAdjacentTo(this.player)) {\n              dx = 0\n              dy = 0\n              var success = monster.attack(this.player)\n              if (success) {\n                logger.appendToLine(`The ${monster.name} hits you.`)\n                this.shouldRenderStats = true\n              } else {\n                logger.appendToLine(`The ${monster.name} misses you.`)\n              }\n              if (this.player.hp <= 0) {\n                logger.appendToLine('You die.')\n                break\n              }\n            } else {\n              var vectors = monster.getApproachVectorsTo(this.player)\n              var vectorFound = false\n              for (var v of vectors) {\n                if (!level.isOccupied[monster.y + v.dy][monster.x + v.dx]) {\n                  dx = v.dx\n                  dy = v.dy\n                  vectorFound = true\n                  break\n                }\n              }\n              if (!vectorFound) {\n                dx = 0\n                dy = 0\n              }\n            }\n          } else {\n            var dirInd = Math.floor(9 * Math.random())\n            var dir = movementKeys[dirInd]\n            ;({ dx, dy } = keyDisplacement[dir])\n            if (level.isOccupied[monster.y + dy][monster.x + dx]) {\n              dx = 0\n              dy = 0\n            }\n          }\n          level.unoccupy(monster)\n          monster.x += dx\n          monster.y += dy\n          level.occupy(monster)\n        }\n      }\n    }\n    logger.finishLine()\n  }\n\n  this.render = function() {\n    if (this.shouldRenderStats) {\n      this.renderStats()\n      this.shouldRenderStats = false\n    }\n    if (this.shouldRenderLog) {\n      this.renderLog()\n      this.shouldRenderLog = false\n    }\n    if (this.shouldRenderLevel) {\n      this.renderLevel()\n      this.shouldRenderLevel = false\n    }\n    if (this.shouldRenderObjects) {\n      this.renderObjects()\n      this.shouldRenderObjects = false\n    }\n    if (this.shouldRenderSeen) {\n      this.renderSeen()\n      this.shouldRenderSeen = false\n    }\n    if (this.shouldRenderVisible) {\n      this.renderVisible()\n      this.shouldRenderVisible = false\n    }\n  }\n\n  this.renderStats = function() {\n    statsRenderer.clear()\n    var statsLines = this.getStatsLines()\n    statsRenderer.drawText(''.padEnd(statsWidth, ' '), defaultTextColor, 0, 0)\n    var iLine = 1\n    for (var line of statsLines) {\n      statsRenderer.drawText(line.padEnd(statsWidth, ' '), defaultTextColor, iLine, 0)\n      iLine += 1\n    }\n    while (iLine < statsHeight) {\n      statsRenderer.drawText(''.padEnd(statsWidth, ' '), defaultTextColor, iLine, 0)\n      iLine += 1\n    }\n  }\n\n  this.renderLog = function() {\n    logRenderer.clear()\n    var logger = Logger.getInstance()\n    var logLines = logger.getLogLines()\n    var iLine = 1\n    for (var line of logLines) {\n      logRenderer.drawText(line, defaultTextColor, -iLine, 0)\n      iLine += 1\n    }\n  }\n\n  this.renderLevel = function() {\n    levelRenderer.clear()\n    var level = this.levels[this.currentLevel]\n    for (var i = 0; i < mapHeight; i++) {\n      for (var j = 0; j < mapWidth; j++) {\n        var tile = level.tileMap[i][j]\n        colorRenderer.drawTile(level.colorMap[tile], i, j)\n        levelRenderer.drawChar(tile, i, j)\n      }\n    }\n  }\n\n  this.renderObjects = function() {\n    objectRenderer.clear()\n    objectRenderer.drawColoredChar(this.player.char, this.player.color, this.player.y, this.player.x)\n\n    var level = this.levels[this.currentLevel]\n    for (var iMonster = 0; iMonster < level.monsters.length; iMonster++) {\n      var monster = level.monsters[iMonster]\n      if (monster.hp > 0 && level.isVisibleMask[monster.y][monster.x]) {\n        objectRenderer.drawColoredChar(monster.char, monster.color, monster.y, monster.x)\n      }\n    }\n  }\n\n  this.renderSeen = function() {\n    var level = this.levels[this.currentLevel]\n    for (var i = 0; i < mapHeight; i++) {\n      for (var j = 0; j < mapWidth; j++) {\n        if (level.seenMask[i][j]) {\n          seenRenderer.clearTile(i, j)\n        } else {\n          seenRenderer.drawChar(' ', i, j)\n        }\n      }\n    }\n  }\n\n  this.renderVisible = function() {\n    var level = this.levels[this.currentLevel]\n    for (var i = 0; i < mapHeight; i++) {\n      for (var j = 0; j < mapWidth; j++) {\n        if (level.isVisibleMask[i][j]) {\n          visibleRenderer.clearTile(i, j)\n        } else if (level.becameNotVisible(i, j)) {\n          visibleRenderer.drawTile('rgba(0, 0, 0, 0.2)', i, j)\n        }\n      }\n    }\n  }\n}\n\nfunction startGame() {\n  var game = new Game();\n\n  function gameLoop() {\n    game.render()\n    window.requestAnimationFrame(gameLoop)\n  }\n\n  window.addEventListener('keyup', function(e) {\n    game.updateState(e)\n  })\n\n  window.requestAnimationFrame(gameLoop)\n}\n\n\n//# sourceURL=webpack://javascript-roguelike/./src/index.js?");

/***/ }),

/***/ "./src/layout.js":
/*!***********************!*\
  !*** ./src/layout.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var { charWidthPixels, charHeightPixels } = __webpack_require__(/*! ./charmap */ \"./src/charmap.js\")\n\n// constants related to game dimensions and layout on screen\n\nvar canvasWidthChars = 80\nvar canvasHeightChars = 25\n\nvar canvasWidth = canvasWidthChars * charWidthPixels\nvar canvasHeight = canvasHeightChars * charHeightPixels\n\nvar mapWidth = 70\nvar mapHeight = 20\n\nvar statsWidth = canvasWidthChars - mapWidth\nvar statsHeight = mapHeight\n\nvar logWidth = canvasWidthChars\nvar logHeight = canvasHeightChars - mapHeight\n\nmodule.exports = {\n  canvasWidthChars,\n  canvasHeightChars,\n  canvasWidth,\n  canvasHeight,\n  mapWidth,\n  mapHeight,\n  statsWidth,\n  statsHeight,\n  logWidth,\n  logHeight\n}\n\n\n//# sourceURL=webpack://javascript-roguelike/./src/layout.js?");

/***/ }),

/***/ "./src/level.js":
/*!**********************!*\
  !*** ./src/level.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var { generateLevel, getRandomRoomPosition } = __webpack_require__(/*! ./map-generator */ \"./src/map-generator.js\")\nvar { mapWidth, mapHeight } = __webpack_require__(/*! ./layout */ \"./src/layout.js\")\nvar { rollMonster } = __webpack_require__(/*! ./monsters */ \"./src/monsters.js\")\nvar { Monster } = __webpack_require__(/*! ./entities */ \"./src/entities.js\")\n\nfunction createEmptyTileMap() {\n  var tileMap = Array(mapHeight)\n  for (var i = 0; i < mapHeight; i++) {\n    tileMap[i] = Array(mapWidth)\n    for (var j = 0; j < mapWidth; j++) {\n      tileMap[i][j] = '#'\n    }\n  }\n  return tileMap\n}\n\nfunction carveRoom(room, level) {\n  for (var i = room.y; i < room.y + room.h; i++) {\n    for (var j = room.x; j < room.x + room.w; j++) {\n      level[i][j] = '.'\n    }\n  }\n}\n\nvar defaultTileColors = {\n  '#': '#666',\n  '.': '#ddd',\n  '<': '#ddd',\n  '>': '#ddd',\n}\n\nvar visBlock = {\n  '#': 0.05,\n  '.': 0.45,\n  '<': 0.45,\n  '>': 0.45,\n}\n\n// Is (x,y) visible from (x0,y0) in tile map level\nfunction isVisible(x, y, x0, y0, level) {\n  var m, xj, yj, yj_, xj_, j, dj, vbj_d, vbj_u, vb_d, vb_u\n  if (Math.abs(y - y0) <= Math.abs(x - x0)) {\n    // \"x-simple\"\n    m = (y - y0) / (x - x0)\n    dj = x < x0 ? -1 : 1\n    vb_d = 0\n    vb_u = 0\n    for (j = 0; Math.abs(j) < Math.abs(x - x0); j += dj) {\n      xj = x0 + j\n      yj = y0 + m * j\n\n      yj_ = Math.floor(yj)\n\n      // Calculate blocked portion of visiblity to both sides\n      vbj_d = 1 - (yj - yj_)\n      vbj_u = 1 - vbj_d\n\n      if (level[yj_][xj] == '#' && vbj_d > vb_d) {\n        vb_d = vbj_d\n      }\n      if (level[yj_ + 1][xj] == '#' && vbj_u > vb_u) {\n        vb_u = vbj_u\n      }\n      if (vb_d + vb_u > 1 - visBlock[level[y][x]]) {\n        return false\n      }\n    }\n  } else {\n    // \"y-simple\"\n    m = (x - x0) / (y - y0)\n    dj = y < y0 ? -1 : 1\n    vb_d = 0\n    vb_u = 0\n    for (j = 0; Math.abs(j) < Math.abs(y - y0); j += dj) {\n      yj = y0 + j\n      xj = x0 + m * j\n\n      xj_ = Math.floor(xj)\n\n      vbj_d = 1 - (xj - xj_)\n      vbj_u = 1 - vbj_d\n\n      if (level[yj][xj_] == '#' && vbj_d > vb_d) {\n        vb_d = vbj_d\n      }\n      if (level[yj][xj_ + 1] == '#' && vbj_u > vb_u) {\n        vb_u = vbj_u\n      }\n      if (vb_d + vb_u > 1 - visBlock[level[y][x]]) {\n        return false\n      }\n    }\n  }\n  return true\n}\n\nfunction Level(level, mapGenParams) {\n  this.level = level\n\n  this.map = generateLevel(mapWidth, mapHeight, mapGenParams)\n  this.tileMap = createEmptyTileMap()\n  this.map.rooms.forEach(room => {\n    carveRoom(room, this.tileMap)\n  })\n  this.map.corridors.forEach(room => {\n    carveRoom(room, this.tileMap)\n  })\n  if (this.map.up) {\n    this.tileMap[this.map.up.y][this.map.up.x] = '<'\n  }\n  if (this.map.down) {\n    this.tileMap[this.map.down.y][this.map.down.x] = '>'\n  }\n\n  this.colorMap = defaultTileColors\n\n  this.seenMask = this.tileMap.map(row => row.map(() => false))\n  this.isVisibleMask = this.tileMap.map(row => row.map(() => false))\n  this.wasVisibleMask = this.tileMap.map(row => row.map(() => false))\n  this.isOccupied = this.tileMap.map(row => row.map(tile => (tile == '#')))\n\n  this.getRandomUnoccupiedTile = function() {\n    var position\n    do {\n      position = getRandomRoomPosition(this.map)\n    } while (this.isOccupied[position.y][position.x])\n    return position\n  }\n\n  this.occupy = function(position) {\n    this.isOccupied[position.y][position.x] = true\n  }\n\n  this.unoccupy = function(position) {\n    this.isOccupied[position.y][position.x] = false\n  }\n\n  this.placePlayer = function(player) {\n    this.occupy(player)\n    for (var i = 0; i < mapHeight; i++) {\n      for (var j = 0; j < mapWidth; j++) {\n        this.wasVisibleMask[i][j] = this.isVisibleMask[i][j]\n        if (player.isWithinVisRadius(i, j) &&\n            isVisible(j, i, player.x ,player.y, this.tileMap)) {\n          this.seenMask[i][j] = true\n          this.isVisibleMask[i][j] = true\n        } else {\n          this.isVisibleMask[i][j] = false\n        }\n      }\n    }\n  }\n\n  this.becameNotVisible = function(i, j) {\n    return this.wasVisibleMask[i][j] && !this.isVisibleMask[i][j]\n  }\n\n  this.hasDownStaircase = function() {\n    return this.map.down\n  }\n  this.hasUpStaircase = function() {\n    return this.map.up\n  }\n  this.isDownStaircaseAt = function(position) {\n    return this.tileMap[position.y][position.x] == '>'\n  }\n  this.isUpStaircaseAt = function(position) {\n    return this.tileMap[position.y][position.x] == '<'\n  }\n  this.getDownStaircasePosition = function() {\n    if (this.hasDownStaircase()) {\n      return this.map.down\n    } else {\n      throw new Error('No down staircase in level')\n    }\n  }\n  this.getUpStaircasePosition = function() {\n    if (this.hasUpStaircase()) {\n      return this.map.up\n    } else {\n      throw new Error('No up staircase in level')\n    }\n  }\n\n  this.monsters = []\n  var numMonsters = 5 + this.level\n  for (var iMonster = 0; iMonster < numMonsters; iMonster++) {\n    var monsterType = rollMonster(this.level)\n    var monster = Monster.fromSpawner(monsterType)\n    var position = this.getRandomUnoccupiedTile()\n    monster.setPosition(position)\n    this.isOccupied[position.y][position.x] = true\n    this.monsters.push(monster)\n  }\n  this.getMonsterAt = function(x, y) {\n    return this.monsters.find(m => m.x == x && m.y == y && m.hp > 0)\n  }\n}\n\nmodule.exports = Level\n\n\n//# sourceURL=webpack://javascript-roguelike/./src/level.js?");

/***/ }),

/***/ "./src/logger.js":
/*!***********************!*\
  !*** ./src/logger.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var {\n  logWidth,\n  logHeight\n} = __webpack_require__(/*! ./layout */ \"./src/layout.js\")\n\n// \"singleton\"\nfunction Logger() {\n  if (Logger.instance) {\n    throw new Error('Use Logger.getInstance')\n  }\n  Logger.instance = this\n  this.logBuffer = [\n    'Welcome!',\n    'Very long line with monsters attacking and all sorts of crazy stuff going on so that this has to be split into multiple lines for sure'\n  ]\n  this.maxLineWidth = logWidth - 2 // '> ' prefix\n  this.lineRegex = new RegExp(`(.{0,${this.maxLineWidth}}$|.{0,${this.maxLineWidth}}\\\\b)`, 'g')\n\n  this.newLine = ''\n  this.appendToLine = function(msg) {\n    if (this.newLine.length == 0) {\n      this.newLine += msg\n    } else {\n      this.newLine += (' ' + msg)\n    }\n  }\n  this.finishLine = function() {\n    if (this.newLine.length > 0) {\n      this.logBuffer.unshift(this.newLine)\n    }\n    this.newLine = ''\n  }\n\n  this.getLogLines = function*() {\n    var linesToDisplay = []\n    var iLine = 0\n    while (linesToDisplay.length < logHeight) {\n      if (iLine < this.logBuffer.length) {\n        var line = this.logBuffer[iLine]\n        var split = line.match(this.lineRegex)\n          .map(part => part.trim())\n          .filter(part => part.length > 0)\n        for (var iPart = split.length - 1; iPart > 0; iPart--) {\n          var part = '  ' + split[iPart]\n          linesToDisplay.push(part)\n        }\n        var firstPart = '> ' + split[0]\n        linesToDisplay.push(firstPart)\n      } else {\n        linesToDisplay.push('  ')\n      }\n      iLine += 1\n    }\n    iLine = 0\n    while (iLine < logHeight) {\n      var line = linesToDisplay[iLine]\n      yield line.padEnd(logWidth, ' ')\n      iLine += 1\n    }\n  }\n}\nLogger.getInstance = function() {\n  return Logger.instance || new Logger()\n}\n\nmodule.exports = Logger\n\n\n//# sourceURL=webpack://javascript-roguelike/./src/logger.js?");

/***/ }),

/***/ "./src/map-generator.js":
/*!******************************!*\
  !*** ./src/map-generator.js ***!
  \******************************/
/***/ ((module) => {

eval("function randInt(n0, n1) {\n  return n0 + Math.floor((n1 - n0 + 1) * Math.random())\n}\n\nfunction overlapRooms(r1, r2) {\n  return (\n    r2.x - r1.w <= r1.x &&\n    r1.x <= r2.x + r2.w &&\n    r2.y - r1.h <= r1.y &&\n    r1.y <= r2.y + r2.h\n  )\n}\n\nfunction getRandomRoomPosition(level) {\n  var iRoom = randInt(0, level.rooms.length - 1)\n  var room = level.rooms[iRoom]\n  var x = randInt(room.x, room.x + room.w - 1)\n  var y = randInt(room.y, room.y + room.h - 1)\n  return { x, y }\n}\n\n// eslint-disable-next-line no-unused-vars\nfunction generateLevel(mapWidth, mapHeight, features) {\n  var mapArea = mapWidth * mapHeight\n\n  var rooms = []\n\n  // Minimum and maximum room width and height\n  var w0 = 5\n  var w1 = 15\n\n  var h0 = 3\n  var h1 = 7\n\n  var roomArea = 0\n  var failures = 0\n\n  // Random integer from {n0, ..., n1} (uniform)\n  /* eslint-disable-next-line no-constant-condition */\n  while (true) {\n    var w = randInt(w0, w1)\n    var h = randInt(h0, h1)\n    // Last index mapWidth - 1, room width + 1 tile wall\n    var x = randInt(1, mapWidth - 1 - (w + 1))\n    var y = randInt(1, mapHeight - 1 - (h + 1))\n    let overlap = false\n    for (var iRoom = 0; iRoom < rooms.length; iRoom++) {\n      var room = rooms[iRoom]\n      if (overlapRooms(room, { x, y, w, h })) {\n        overlap = true\n        break\n      }\n    }\n    if (overlap) {\n      failures += 1\n      if (failures > 100) {\n        break\n      }\n      continue\n    }\n    // console.log('placing room, w=' + w + ', h=' + h + ', x=' + x + ', y=' + y)\n    rooms.push({\n      x,\n      y,\n      w,\n      h,\n      c: false, // connected\n    })\n    roomArea += w * h\n    /*\n    console.log(\n      'placed ' +\n        rooms.length +\n        ' rooms with area ' +\n        roomArea +\n        ' of ' +\n        mapArea\n    )\n    */\n    if (roomArea / mapArea > 0.33 || rooms.length > 10) {\n      break\n    }\n  }\n\n  var corridors = []\n  var corridorsAsRooms = []\n\n  // Start placing connectiong with rooms 0 and 1\n  var j = 0,\n    k = 1\n\n  while (j < rooms.length && k < rooms.length) {\n    var room_j = rooms[j]\n    var room_k = rooms[k]\n    // console.log('corridor between ' + j + ' and ' + k)\n\n    // Pick two points within these rooms at random\n    var xj = randInt(room_j.x, room_j.x + room_j.w - 1)\n    var yj = randInt(room_j.y, room_j.y + room_j.h - 1)\n\n    var xk = randInt(room_k.x, room_k.x + room_k.w - 1)\n    var yk = randInt(room_k.y, room_k.y + room_k.h - 1)\n\n    // Starting direction of corridor at random\n    var dir = randInt(0, 1)\n    var xjk, yjk\n    if (dir) {\n      // vertically from room j\n      xjk = xj\n      yjk = yk\n    } else {\n      // horizontally from room j\n      xjk = xk\n      yjk = yj\n    }\n\n    var c = {\n      xj,\n      yj,\n      xjk,\n      yjk,\n      xk,\n      yk,\n    }\n    corridors.push(c)\n\n    // Corridor as two (single tile wide) rooms\n    var c1, c2\n    if (dir) {\n      c1 = {\n        x: xj,\n        y: Math.min(yj, yk),\n        w: 1,\n        h: Math.abs(yj - yk) + 1,\n      }\n      c2 = {\n        x: Math.min(xj, xk),\n        y: yk,\n        w: Math.abs(xj - xk) + 1,\n        h: 1,\n      }\n    } else {\n      c1 = {\n        x: Math.min(xj, xk),\n        y: yj,\n        w: Math.abs(xj - xk) + 1,\n        h: 1,\n      }\n      c2 = {\n        x: xk,\n        y: Math.min(yj, yk),\n        w: 1,\n        h: Math.abs(yj - yk) + 1,\n      }\n    }\n\n    corridorsAsRooms.push(c1)\n    corridorsAsRooms.push(c2)\n\n    // Loop over unconnected rooms, see if new corridor overlaps them\n    rooms[j].connected = true\n    rooms[k].connected = true\n\n    for (var i = 0; i < rooms.length; i++) {\n      var r = rooms[i]\n      if (r.connected) {\n        // console.log('room ' + i + ' already connected')\n        continue\n      }\n      let overlap = overlapRooms(r, c1) || overlapRooms(r, c2)\n\n      if (overlap) {\n        /*\n        console.log(\n          'room ' +\n            JSON.stringify(rooms[i]) +\n            ' overlaps with corridor ' +\n            JSON.stringify(c)\n        )\n        */\n        rooms[i].connected = true\n      }\n    }\n\n    // Re-assign j and k so that j is a connected room and k non-connected\n    j = k\n    while (k < rooms.length && rooms[k].connected) {\n      k++\n    }\n  }\n\n  var levelMap = {\n    rooms,\n    corridors: corridorsAsRooms,\n  }\n\n  if (features.up) {\n    // Staircase up\n    var upPos = getRandomRoomPosition(levelMap)\n    levelMap.up = { x: upPos.x, y: upPos.y }\n  }\n  if (features.down) {\n    // Staircase down\n    var downPos = getRandomRoomPosition(levelMap)\n    levelMap.down = { x: downPos.x, y: downPos.y }\n  }\n\n  return levelMap\n}\n\nmodule.exports = {\n  generateLevel,\n  randInt,\n  getRandomRoomPosition\n}\n\n\n//# sourceURL=webpack://javascript-roguelike/./src/map-generator.js?");

/***/ }),

/***/ "./src/monsters.js":
/*!*************************!*\
  !*** ./src/monsters.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var { randInt } = __webpack_require__(/*! ./map-generator */ \"./src/map-generator.js\")\n\nvar monsterDictionary = [\n  {\n    name: 'small monster',\n    char: 'g',\n    color: 'red',\n    spawnWeight: level => 1 / (level + 1),\n    hp: level => [1, 1],\n    hitChance: level => [10, 20],\n    hitDamage: level => [1, 1]\n  },\n  {\n    name: 'monster',\n    char: 'g',\n    color: 'darkred',\n    spawnWeight: level => 1.0,\n    hp: level => [1, 1 + Math.floor(level / 2)],\n    hitChance: level => [10 + level, 20 + 2 * level],\n    hitDamage: level => [1, 1 + Math.floor(level / 4)]\n  },\n  {\n    name: 'large monster',\n    char: 'G',\n    color: 'brown',\n    spawnWeight: level => level / 20,\n    hp: level => [5, 5 + level],\n    hitChance: level => [10 + level, 20 + 2 * level],\n    hitDamage: level => [2, 2 + Math.floor(level / 2)]\n  },\n  {\n    name: 'huge monster',\n    char: 'G',\n    color: 'darkbrown',\n    spawnWeight: level => level / 500,\n    hp: level => [10, 10 + level],\n    hitChance: level => [20 + level, 30 + 2 * level],\n    hitDamage: level => [4, 4 + level]\n  }\n]\n\nfunction generateSpawnerFrom(entry, level) {\n  var hpBounds = entry.hp(level)\n  var hitChanceBounds = entry.hitChance(level)\n  var hitDamageBounds = entry.hitDamage(level)\n  return {\n    name: entry.name,\n    char: entry.char,\n    color: entry.color,\n    hp: () => randInt(hpBounds[0], hpBounds[1]),\n    hitChance: () => randInt(hitChanceBounds[0], hitChanceBounds[1]) / 100,\n    hitDamage: () => randInt(hitDamageBounds[0], hitDamageBounds[1])\n  }\n}\n\nfunction rollMonster(level) {\n  var roll = Math.random()\n  var weightSum = monsterDictionary.reduce((acc, curr) => acc + curr.spawnWeight(level), 0)\n  var cumulativeWeight = 0\n  for (var i = 0; i < monsterDictionary.length; i++) {\n    var entry = monsterDictionary[i]\n    cumulativeWeight += entry.spawnWeight(level) / weightSum\n    if (roll < cumulativeWeight) {\n      var spawner = generateSpawnerFrom(entry, level)\n      return spawner\n    }\n  }\n}\n\nmodule.exports = {\n  rollMonster,\n}\n\n\n//# sourceURL=webpack://javascript-roguelike/./src/monsters.js?");

/***/ }),

/***/ "./src/renderer.js":
/*!*************************!*\
  !*** ./src/renderer.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var {\n  charOffsetX,\n  charOffsetY,\n  charWidthPixels,\n  charHeightPixels,\n  charMap\n} = __webpack_require__(/*! ./charmap */ \"./src/charmap.js\")\n\nvar {\n  canvasWidth,\n  canvasHeight\n} = __webpack_require__(/*! ./layout */ \"./src/layout.js\")\n\nfunction Renderer(id, top, left, width, height) {\n  this.id = id\n\n  this.top = top\n  this.left = left\n  this.width = width\n  this.height = height\n\n  this.context = null\n\n  this.init = function(container, charSheet) {\n    var canvas = document.createElement('canvas')\n    canvas.className = 'game-canvas'\n    canvas.setAttribute('id', id)\n    canvas.setAttribute('width', canvasWidth)\n    canvas.setAttribute('height', canvasHeight)\n    canvas.style.transform = `translate(${canvasWidth / 2}px,${canvasHeight / 2}px)scale(2)`\n    container.appendChild(canvas)\n\n    this.context = canvas.getContext('2d')\n    this.charSheet = charSheet\n\n    return this\n  }\n\n  this.clear = function() {\n    this.context.clearRect(0, 0, canvasWidth, canvasHeight)\n  }\n\n  this.drawChar = function(char, i, j) {\n    if (!(char in charMap)) {\n      throw new Error('invalid char: ' + char)\n    }\n    this.context.drawImage(\n      this.charSheet,\n      charOffsetX + charMap[char].j * charWidthPixels,\n      charOffsetY + charMap[char].i * charHeightPixels,\n      charWidthPixels,\n      charHeightPixels,\n      (this.left + j) * charWidthPixels,\n      (this.top + i) * charHeightPixels,\n      charWidthPixels,\n      charHeightPixels\n    )\n  }\n\n  this.drawText = function(text, color, i, j) {\n    // negative i means count lines from bottom\n    for (var k = 0; k < text.length; k++) {\n      this.drawColoredChar(text[k], color, i >= 0 ? i : this.height + i, j + k)\n    }\n  }\n\n  this.drawTile = function(color, i, j) {\n    this.context.fillStyle = color\n    this.context.fillRect(\n      (this.left + j) * charWidthPixels,\n      (this.top + i) * charHeightPixels,\n      charWidthPixels,\n      charHeightPixels\n    )\n  }\n\n  this.clearTile = function(i, j) {\n    this.context.clearRect(\n      (this.left + j) * charWidthPixels,\n      (this.top + i) * charHeightPixels,\n      charWidthPixels,\n      charHeightPixels\n    )\n  }\n\n  this.drawColoredChar = function(char, color, i, j) {\n    this.drawTile(color, i, j)\n    this.drawChar(char, i, j)\n  }\n\n  this.fillWithChar = function(char) {\n    for (var i = 0; i < this.height; i++) {\n      for (var j = 0; j < this.width; j++) {\n        this.drawChar(char, i, j)\n      }\n    }\n  }\n}\n\nmodule.exports = Renderer\n\n\n//# sourceURL=webpack://javascript-roguelike/./src/renderer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;