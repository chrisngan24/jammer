function JamSession(id) {
  this.timer = 0;
  this.id = id;
  this.players = 0;
  // defaults to paused
  this.paused=true;
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
    paused: this.paused
  }
};

JamSession.prototype.sessionPaused = function(){
  return this.paused
};

// deserialize
JamSession.fromJson = function(json){
  var j = new JamSession(json.id);
  j.timer = json.timer;
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
