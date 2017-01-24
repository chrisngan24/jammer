var piano = null;
console.log('hi');
var GLOB = null;
$(document).ready(function(){ 
  var ROOM_ID = window.location.hash.substr(1)


  var jamSession = new JamSession(ROOM_ID);
  var emitServer = function(note, octave){
    socket.emit("playedNotes", { note: note, octave: octave});
    
  };
  $("body").keydown(function(e) {
    GLOB = e;
    console.log( "Handler for .keypress() called." +e.key.toLowerCase());
    switch(e.key.toLowerCase()) {
      case "a": emitServer("C", 4); break;
      case "w": emitServer("C#", 4); break;
      case "s": emitServer("D", 4); break;
      case "e": emitServer("D#", 4); break;
      case "d": emitServer("E", 4); break;
      case "f": emitServer("F", 4); break;
      case "t": emitServer("F#", 4); break;
      case "g": emitServer("G", 4); break;
      case "y": emitServer("G#", 4); break;
      case "h": emitServer("A", 4); break;
      case "u": emitServer("A#", 4); break;
      case "j": emitServer("B", 4); break;
      // next octave
      case "k": emitServer("C", 5); break;
    }
    
  });
  //Synth.setSampleRate(20000);
  piano = Synth.createInstrument('piano');
  //var socket = io('http://localhost:3001', { 
  var hostUrl ='http://' + window.location.hostname
  if (window.location.port != ''){
    hostUrl += ':' + window.location.port;
  }
  var socket = io(hostUrl, {
      //
    query : "roomId=" +  ROOM_ID
  });
  socket.on('soundFrame', function(msg){
    jamSession = JamSession.fromJson(msg);
    jamSession.playFrame(piano);
    $('#future').empty();
    jamSession.notes.forEach(function(note){
      $('#future').append(note.note);
    });
  });
});

