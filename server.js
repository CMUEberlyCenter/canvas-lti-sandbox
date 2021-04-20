'use strict';

var finalhandler = require('finalhandler');
var connect = require('connect');
var serveStatic = require('serve-static');
var fs = require('fs');
var http = require('http');

var serve = serveStatic("./dist/", { 'index': ['index.html', 'index.htm'] });

/**
 *
 */
class GalleryLTIService {

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
      serve(req, res, finalhandler(req, res));
    }).listen(8880);
  }
}

var service=new GalleryLTIService ();
service.run();
