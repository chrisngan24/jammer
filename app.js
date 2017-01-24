var express = require('express');

var app = express();

var server = require('http').createServer(app);  
var io = require('socket.io')(server);


//project files
var JamSession = require('./JamSession');

app.use(express.static(__dirname + '/bower_components'));  
app.use(express.static(__dirname + '/static'));  
app.use(express.static(__dirname + '/'));  

// global params
// how frequent each sound frame is emmited to clients
var milliseconds = 50;

// global objects
var SESSION_MAP = {};
var ROOM_INTERVALS = {};


var generateRoom = function() {
  var result = '';
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

io.sockets.on('connection', function (socket) {
  // get room Id from client *HACKY*
  var roomId = (socket.handshake.query.roomId);
  console.log('User trying to join room ' + roomId);
  if (roomId in SESSION_MAP){
    // check if the room is legit
    console.log('\tUser joined room ' + roomId);
    socket.join(roomId);
    SESSION_MAP[roomId].players += 1;
    io.to(roomId).emit('playerJoin', { msg : 'sup' });
    if (SESSION_MAP[roomId].players == 1 && SESSION_MAP[roomId].sessionPaused()) {
      startRoom(roomId);
    }
    socket.on('playedNotes', function(note){
      console.log(note);
      SESSION_MAP[roomId].addNote(note['note'], note['octave']);
    });
  } else {
    console.log('\t Room ' + roomId + ' is not a legit room');
  }
  socket.on('disconnect', function(){
    console.log('User disconnecte from room ' + roomId);
    if (SESSION_MAP[roomId] != undefined){
      SESSION_MAP[roomId].players -= 1;
      if (SESSION_MAP[roomId].isEmpty() && !SESSION_MAP[roomId].sessionPaused()){
        pauseRoom(roomId);
      }
    }
  });
});




// Start the jam session

function createRoom(roomId) {
  SESSION_MAP[roomId] = new JamSession(roomId);
  
  return true;
};

function startRoom(roomId){
  SESSION_MAP[roomId].interval = setInterval(
    function(){ 

      SESSION_MAP[roomId].timer += milliseconds;
      emitRoomId(roomId);
    }, 
    milliseconds
  );
  SESSION_MAP[roomId].paused = false;
  console.log('\t Room ' + roomId + ' is started');
};
function pauseRoom(roomId) {
  console.log('Pausing room ' + roomId);
  SESSION_MAP[roomId].timer = 0;
  clearInterval(SESSION_MAP[roomId].interval);
  SESSION_MAP[roomId].paused = true;
};

// emit frame session to clients
function emitRoomId(roomId){
  io.to(roomId).emit('soundFrame', SESSION_MAP[roomId].toJson());
  SESSION_MAP[roomId].emptyFrame();
};

// hardcode a room for testing
createRoom('123');


server.listen(3001, function () {
  console.log('Example app listening on port 3001!')
});
