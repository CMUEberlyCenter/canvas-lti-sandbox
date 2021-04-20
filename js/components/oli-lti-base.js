/**
 *
 */

/**
*
*/	
export default class OLILTIBase {
	  
  /**
   *
   */ 
  olidebug (aMessage) {
  	console.log (aMessage);
  }
  
  /**
   *
   */
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  /**
   *
   */
  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  /**
   * 
   */
  stringCompare (aString1,aString2) {
	  return (aString1.toUpperCase() === aString2.toUpperCase());  
  }

  /**
   * Need to replace this with the Turogen version below. That one properly uses basic
   * credentials. Currently this method is only used by the Rocketchat code.
   */
  getRequest (aURL,aSucceedCallback,aFailCallback, aHeaders) {
    this.olidebug ("getRequest ()");
    
    if (typeof aHeaders == 'undefined') {     
      $.ajax({
        url: aURL,
        type: 'GET',
        contentType: 'application/json',
        accepts: "application/json; charset=utf-8; version=2.0"
      }).done(function(reply) {
        console.log ("getRequest succeeded");
       
        if (aSucceedCallback) {
          aSucceedCallback (reply);
        }
      }).fail(function(result) {
        console.log("getRequest failed");
      
        if (aFailCallback) {
          aFailCallback (result);
        }
      });
    } else {
       $.ajax({
        url: aURL,
        type: 'GET',
        contentType: 'application/json',
        accepts: "application/json; charset=utf-8; version=2.0",
        headers: aHeaders
      }).done(function(reply) {
        console.log ("getRequest succeeded");
       
        if (aSucceedCallback) {
          aSucceedCallback (reply);
        }
      }).fail(function(result) {
        console.log("getRequest failed");
      
        if (aFailCallback) {
          aFailCallback (result);
        }
      });     
    }       
  }

  /**
   * Need to replace this with the Turogen version below. That one properly uses basic
   * credentials. Currently this method is only used by the Rocketchat code.
   */
  postRequest (aURL, aData, aSucceedCallback, aFailCallback, aHeaders) {    
    if (typeof aHeaders == 'undefined') { 
      this.olidebug ("postRequest () (without headers)");
      this.olidebug (JSON.stringify (aData));
      $.ajax({
        url: aURL,
        type: 'POST',
        contentType: 'application/json',
        accepts: "application/json; charset=utf-8; version=2.0",
        data: JSON.stringify (aData)//,
        //xhrFields: {withCredentials: true},
      }).done(function(reply) {
        console.log ("postRequest succeeded");
      
        if (aSucceedCallback) {
          aSucceedCallback (reply);
        }
      }).fail(function(result) {
        console.log ("postRequest failed");
      
        if (aFailCallback) {
          aFailCallback (result);
        }
      });
    } else {
      this.olidebug ("postRequest () (with headers)");
      this.olidebug (JSON.stringify (aData));
      $.ajax({
        url: aURL,
        type: 'POST',
        contentType: 'application/json',
        accepts: "application/json; charset=utf-8; version=2.0",
        data: JSON.stringify (aData),
        headers: aHeaders
      }).done(function(reply) {
        console.log ("postMessage succeeded");
      
        if (aSucceedCallback) {
          aSucceedCallback (reply);
        }
      }).fail(function(result) {
        console.log ("postMessage failed");
      
        if (aFailCallback) {
          aFailCallback (result);
        }
      });  
    }     
  }

  /**
   * We're layering a Promise on top of JQuery for two reasons. First of all the data coming
   * back can't be immediately handed back to the calling object. Chances are we might have
   * to do some additional processing. Second, We will probably remove the jQuery dependency
   * and use something like fetch or Axios.
   * 
   * Need to refactor this to be non-Tutorgen specific
   */ 
  getRequestTutorgen (aURL) {
    window.tutorgen.olidebug ("getRequest ("+aURL+") -> " + window.tutorgen.authString);

    return new Promise (function (resolve,reject) {
      $.ajax({
        url: aURL,
        type: 'GET',
        contentType: 'application/json',
        accepts: "application/json; charset=utf-8; version=4.0",
        xhrFields: { withCredentials: true },
        beforeSend:  function (xhr) { 
          //console.log ("Setting auth header to: " + window.tutorgen.authString); 
          xhr.setRequestHeader ("Authorization", "Basic " + window.tutorgen.authString); 
        }
      }).done(function(reply) {
        window.tutorgen.olidebug("getRequest succeeded");
        resolve (reply);
      }).fail(function(result) {
        window.tutorgen.olidebug("getRequest failed!");
        reject (result.responseJSON);
      }); 
    });
  }

  /**
   * We're layering a Promise on top of JQuery for two reasons. First of all the data coming
   * back can't be immediately handed back to the calling object. Chances are we might have
   * to do some additional processing. Second, We will probably remove the jQuery dependency
   * and use something like fetch or Axios.
   *
   * Need to refactor this to be non-Tutorgen specific
   */ 
  postRequestTutorgen (aURL,aData) {
    window.tutorgen.olidebug ("postRequestTutorgen ("+aURL+") -> " + window.tutorgen.authString);

    return new Promise (function (resolve,reject) {
      $.ajax({
        url: aURL,
        type: 'POST',
        contentType: 'application/json',
        accepts: "application/json; charset=utf-8; version=4.0",
        data: JSON.stringify (aData),
        xhrFields: { withCredentials: true },
        beforeSend:  function (xhr) { 
          //console.log ("Setting auth header to: " + window.tutorgen.authString); 
          xhr.setRequestHeader ("Authorization", "Basic " + window.tutorgen.authString); 
        }
      }).done(function(reply) {
        window.tutorgen.olidebug("postRequest succeeded");
        resolve (reply);
      }).fail(function(result) {
        window.tutorgen.olidebug("postRequest failed!");
        reject (result.responseJSON);
      }); 
    });
  }  

  /**
   * We're layering a Promise on top of JQuery for two reasons. First of all the data coming
   * back can't be immediately handed back to the calling object. Chances are we might have
   * to do some additional processing. Second, We will probably remove the jQuery dependency
   * and use something like fetch or Axios.
   *
   * Need to refactor this to be non-Tutorgen specific
   */ 
  postRequestPromise (aURL,aData) {
    console.log ("postRequestPromise ("+aURL+")");

    return new Promise (function (resolve,reject) {
      $.ajax({
        url: aURL,
        type: 'POST',
        contentType: 'application/json',
        accepts: "application/json; charset=utf-8; version=4.0",
        data: JSON.stringify (aData)
      }).done(function(reply) {
        console.log("postRequest succeeded");
        resolve (reply);
      }).fail(function(result) {
        console.log("postRequest failed!");
        reject (result.responseJSON);
      }); 
    });
  }    

  /**
   * Useful method for those cases you need a callback that tells you what happened without
   * writing a whole method from scratch just for that purpose.
   */
  dummy (e) {
    console.log ("dummy ()");
    if (typeof e !== 'undefined') {  
      console.log (JSON.stringify (e));
    }
  }
}
