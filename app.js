var express = require('express');

var app = express();

var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/bower_components'));  
app.use(express.static(__dirname + '/static'));  

//app.listen(80);
//
//app.get('/', function (req, res) {
//    res.sendfile(__dirname + '/index.html');
//});
//
//
var socketMap = {};

function onSocketConnection(roomId) {
};

var generateRoom = function() {
  var result = "";
  var n = 4;
  for (var i = 0; i < n; i++){
    result += Math.floor(Math.random()*10).toString();
  }
  return result;
};

app.get('/', function(req, res,next) {  
  var roomId = generateRoom(); 
  res.sendFile(__dirname + '/index.html');
});

var roomId = '123';
io.sockets.on('connection', function (socket) {
  console.log("connected");
  socket.join(roomId);
  io.to(roomId).emit('played', { msg : 'sup' });
});
  

app.get('/jam_session/:roomId', function(req, res, next) {
  var roomId = req.params.roomId;
});

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
