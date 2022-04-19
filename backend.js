var express = require('express')
var bodyParser = require('body-parser')
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
app.use(bodyParser.json())

function validateBody(body) {
  // TODO
  return true
}

app.post('/roguelike/hof', (req, res) => {
  if (validateBody(req.body)) {
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
      ])
    var hof = db.all('SELECT * FROM RoguelikeHof ORDER BY Score DESC LIMIT 8', (err, rows) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        res.json(rows)
      }
    })
  } else {
    res.sendStatus(400)
  }
})

app.listen(3001, () => {
  console.log('app listening')
})
