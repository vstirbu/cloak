/* jshint node:true */

var _ = require('lodash');
var uuid = require('node-uuid');

module.exports = User;

function User(cloak, socket, data) {
  this.cloak = cloak;
  this.id = uuid.v4();
  this._socket = socket;
  this.name = 'Nameless User';
  this.disconnectedSince = null;
  this.data = data || {};
}

User.prototype.message = function(name, arg) {
  this._socket.emit('message-' + name, arg);
};

User.prototype._serverMessage = function(name, arg) {
  this._socket.emit('cloak-' + name, arg);
};

User.prototype.leaveRoom = function() {
  if (!_.isUndefined(this.room)) {
    this.room.removeMember(this);
  }
};

User.prototype.joinRoom = function(room) {
  room.addMember(this);
};

User.prototype.getRoom = function() {
  return this.room;
};

User.prototype.connected = function() {
  return this.disconnectedSince === null;
};

User.prototype._userData = function() {
  return {
    id: this.id,
    name: this.name
  };
};

User.prototype.delete = function() {
  this.disconnectedSince = this.disconnectedSince || new Date().getTime();
  this.leaveRoom();
  this._socket.disconnect();
  this.cloak._deleteUser(this);
};
