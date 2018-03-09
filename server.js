//console.log("you working?");
//hip-hop-quotables is db name


const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;

var db

MongoClient.connect("mongodb://nas:nyco1234@ds261838.mlab.com:61838/hip-hop-quotables", (err, database) => {
  // ... start the server
  if (err) return console.log(err)
  db = database.db("hip-hop-quotables") // whatever your database name is
  app.listen(3000, function () {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
var cursor = db.collection('hip-hop-quotables').find().toArray((err, results) => {
  if (err) return console.log(err)
res.render('index.ejs', {quotable: results})
//console.log(results)
// send HTML file populated with quotes here
})
// res.sendFile(__dirname + '/index.html')
})

app.post('/quotable', (req, res) => {
  db.collection('hip-hop-quotables').save({name: req.body.name, quote: req.body.quote, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
     console.log('saved to database')
     res.redirect('/')
  })
})



//app.get(path, callback)


app.put('/thumbUp', (req, res) => {
  db.collection('hip-hop-quotables')
  .findOneAndUpdate({name: req.body.name, quote: req.body.quote}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result);
  });
});

app.put('/thumbDown', (req, res) => {
  db.collection('hip-hop-quotables')
  .findOneAndUpdate({name: req.body.name, quote: req.body.quote}, {
    $set: {
      thumbDown:req.body.thumbDown + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotable', (req, res) => {
  db.collection('hip-hop-quotables')
  .findOneAndDelete({name: req.body.name, quote: req.body.quote}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('quotable deleted!')
  })
})

// app.listen(3000, function() {
//   console.log('listening on 3000')
// })
