'use strict';

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var fs = require('fs');
var http = require('http');

var serve = serveStatic("./public/", { 'index': ['index.html', 'index.htm'] });

/**
 *
 */
class EberlyCanvasLTISandbox {

  /**
   *
   */
  constructor () {
    console.log ("constructor ()");
  }
 
  /**
   *
   */
  run () {
    console.log ("run ()");

    http.createServer(function (req, res) {
      console.log ("Processing request ...");
      serve(req, res, finalhandler(req, res));
    }).listen(8086, '127.0.0.1');
  }
}

var service=new EberlyCanvasLTISandbox ();
service.run();
