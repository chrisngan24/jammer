function JamSession(id) {
  this.timer = 0;
  this.id = id;
  this.players = 0;
  // defaults to paused
  this.paused=true;
  this.notes = [];
}
JamSession.prototype.isEmpty = function(){
  return this.players == 0;
};

//serialize
JamSession.prototype.toJson = function(){
  return {
    id : this.id,
    timer : this.timer,
    players : this.players,
    paused: this.paused,
    notes: this.notes
  }
};

JamSession.prototype.playFrame = function(instrument){
  this.notes.forEach(function(note){
    instrument.play(note['note'], note['octave'],2);
  });
};

JamSession.prototype.emptyFrame = function(instrument){
  this.notes = [];
};

JamSession.prototype.sessionPaused = function(){
  return this.paused
};

JamSession.prototype.addNote = function(note, octave){
  this.notes.push({note: note, octave: octave});
};

// deserialize
JamSession.fromJson = function(json){
  var j = new JamSession(json.id);
  j.timer = json.timer;
  j.players = json.players;
  j.paused = json.paused;
  j.notes = json.notes;
  return j;
};

JamSession.prototype.getFrameData = function(){
  return {
    time: this.timer
  }
};


//if part of server, adds to expor
//// if part of client, do nothing
if (typeof module != 'undefined'){
  module.exports = JamSession;
}
