console.log('hi');
$(document).ready(function(){
  var socket = io('http://localhost:3000');
  socket.on('played', function(msg){
    $('#future').append($('<li>').text(msg.msg.toString()));
  });
});

