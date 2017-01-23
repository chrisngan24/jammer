console.log('hi');
var GLOB = null;
$(document).ready(function(){
  var socket = io('http://localhost:3001', { 
    query : "roomId=" + window.location.hash.substr(1)
  });
  socket.on('soundFrame', function(msg){
    var jamSession = JamSession.fromJson(msg);
    $('#future').empty();
    $('#future').text(jamSession.timer);
  });
});

