const express = require('express')
const bodyParser = require('body-parser');
const app = express()

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000))
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
  // ejs engine picks ./views/index.ejs
  res.render('index');
})

app.post('/', function (req, res) {
  console.log(req.body.city);
  res.render('index', {city:req.body.city});  
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
