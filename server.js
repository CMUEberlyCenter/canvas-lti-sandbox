'use strict';

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var dotenv = require('dotenv');
var fs = require('fs');
var http = require('http');

// https://www.npmjs.com/package/serve-static
var serve = serveStatic("public", { 
  'index': ['index.html', 'index.htm'],
  'dotfiles': 'deny'
});

dotenv.config ();

/**
 *
 */
class EberlyCanvasLTISandbox {

  /**
   *
   */
  constructor () {
    console.log ("constructor ()");

    this.bindPort=8086;
    this.bindAddress="127.0.0.1";
  }
 
  /**
   *
   */
  run () {
    console.log ("run ()");

    const bAddr=process.env.ADDRESS;

    if (bAddr) {
      this.bindAddress=bAddr;
    }

    console.log ("Starting server at: " + this.bindAddress + ":" + this.bindPort);

    http.createServer(function (req, res) {
      console.log ("Processing request ...");
      serve(req, res, finalhandler(req, res));
    }).listen(this.bindPort, this.bindAddress);
  }
}

var service=new EberlyCanvasLTISandbox ();
service.run();
