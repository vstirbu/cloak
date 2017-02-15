/* jshint node:true */

// Nodeunit tests for Cloak client and server

var _ = require('lodash');
var debug = require('debug')('cloak:super-suite');

var cloakServer = require('../../src/server');
var createCloakClient = require('../../src/client/cloak');

var clients;

module.exports = {

  // setUp is called before every test
  // Pepare a server and an empty client list
  setUp: function(callback) {
    try {
      this.port = 8091;
      this.host = 'http://localhost:' + this.port;
      this.server = cloakServer;
      this.server.configure({}); // reset config
      clients = [];
      callback();
    }
    catch(e) {
      console.error(e);
    }
  },

  // tearDown is called after every test
  // Shut down server and all clients
  tearDown: function(callback) {
    try {
      _.forEach(clients, function(client) {
        if (client.connected()) {
          debug('ending client');
          client.stop();
        }
        else {
          debug('client already disconnected');
        }
      });
      clients = null;
      debug('stopping server');
      this.server.stop(function() {
        debug('server stopped');
        callback();
      });
    }
    catch(e) {
      console.error(e);
    }
  },

  // Used in tests to create a new Cloak client. Using this
  // function instead of doing it manually means clients
  // will be properly cleaned up after tests are done.
  createClient: function() {
    var client;

    delete require.cache[require.resolve('../../src/client/cloak')];
    client = require('../../src/client/cloak');
    clients.push(client);

    return client;
  }

};
