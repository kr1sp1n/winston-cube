/*
 * winston-cube.js: Transport for emitting events to a Cube Collector
 *
 * (C) 2012 Krispin Schulz
 * MIT LICENCE
 *
 */

var util = require('util'),
    cube = require('cube'),
    winston = require('winston');

//
// ### function Cube (options)
// Constructor for the Cube transport object.
//

var Cube = exports.Cube = winston.transports.Cube = function (options) {
    options       = options || {};
 	options.debug = options.debug || false;
    
    this.name     = 'cube';

    this.host     = options.host     || 'localhost';
    this.port     = options.port     || 1180;
    this.protocol = options.protocol || 'udp';

    this.client = cube.emitter(this.protocol+"://"+this.host+":"+this.port);

	//client.close();
  };

  //
  // Inherit from `winston.Transport` so you can take advantage
  // of the base functionality and `.handleExceptions()`.
  //
  util.inherits(Cube, winston.Transport);

  Cube.prototype.log = function (level, msg, meta, callback) {
    var self = this;
    if(meta===undefined) {
    	//util.log("NO META");
    } else {
    	self.client.send({
    		type: msg,
    		time: new Date(),
    		data: meta
    	});
    }
    callback(null, true); 
  };