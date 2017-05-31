const express = require('express');
const bodyParser = require('body-parser');

var app = module.exports = express();

const port = 8082
app.use(express.static(__dirname + '/build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');

const serverCtrl = require('./serverCtrl.js');

app.get('/character/:name', serverCtrl.getUserByName);
app.get('/characters', serverCtrl.getUsers);
app.get('/planetresidents', serverCtrl.getPlanetResidents);



app.listen(port, function () {
  console.log('LISTENING..........' + port);
});
