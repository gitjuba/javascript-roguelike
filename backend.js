var bodyParser = require('body-parser')
var cors = require('cors')
var express = require('express')
var _ = require('lodash')
var sqlite = require('sqlite3')

var db = new sqlite.Database('hof.db')
db.run(`
  CREATE TABLE IF NOT EXISTS
    RoguelikeHof (
      Player TEXT,
      Score INTEGER,
      Date DATE,
      DungeonLevel INTEGER,
      CauseOfDeath TEXT,
      Version TEXT
    )`)

var app = express()
app.use(cors())
app.use(bodyParser.json())

function validateBody(body) {
  // TODO
  var okPlayer = _.isString(body.player) && body.player.length > 0 && body.player.length <= 8
  var okScore = _.isInteger(body.score) && body.score >= 0 && body.score < 1e6
  var okDate = _.isString(body.date) && body.date.length == 10 && !_.isNaN(Date.parse(body.date))
  var okLevel = _.isInteger(body.dungeonLevel) && body.dungeonLevel >= 0 && body.dungeonLevel < 1e6
  var okCause = _.isString(body.causeOfDeath) && body.causeOfDeath.length < 50
  var okVersion = _.isString(body.version) && body.version.match(/\d+\.\d+\.\d+/)
  return okPlayer && okScore && okDate && okLevel && okCause && okVersion
}

app.post('/roguelike/hof', (req, res) => {
  if (validateBody(req.body)) {
    console.log(req.body)
    db.get('SELECT COUNT(*) AS Ranking FROM RoguelikeHof WHERE Version = ? AND Score >= ?', [req.body.version, req.body.score], (err, row) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        var ranking = row.Ranking
        console.log('ranking: ' + JSON.stringify(row))
        db.run(`
        INSERT INTO
          RoguelikeHof
            (Player, Score, Date, DungeonLevel, CauseOfDeath, Version)
        VALUES (?, ?, ?, ?, ?, ?)`, [
          req.body.player,
          req.body.score,
          req.body.date,
          req.body.dungeonLevel,
          req.body.causeOfDeath,
          req.body.version
        ], (err) => {
          if (err) {
            console.log(err)
            res.sendStatus(500)
          } else {
            db.all('SELECT * FROM RoguelikeHof ORDER BY Score DESC LIMIT 8', (err, rows) => {
              if (err) {
                console.log(err)
                res.sendStatus(500)
              } else {
                res.json({
                  ranking,
                  hof: rows
                })
              }
            })
          }
        })
      }
    })
  } else {
    res.sendStatus(400)
  }
})

app.listen(3001, () => {
  console.log('app listening')
})
