import React, { Component } from 'react';

import $ from 'jquery';

import OLILTIBase from './oli-lti-base.js';
import OLILTIXML from './oli-lti-xml.js';

import * as oauth from 'oauth-signature';
import oauthSignature from 'oauth-signature';

import canvasMockMenu from '../../css/images/canvas-menu.png';

import '../../css/main.css';

/**
 * 
 */
export default class CanvasDrydock extends Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.state = {
      nonce: this.uuidv4(),
      ltiFirstname: "",
      ltiLastname: "",
      ltiEmail: "",
      ltiTitle: "Eberly Canvas LTI Simulator",
      ltiKey: this.uuidv4(),
      ltiSecret: this.uuidv4(),
      ltiURL: "http://localhost",
      ltiCartridge: "",
      ltiActivityID: "Demo Activity",
      ltiRole: "student",
      statusMessage: "Sanbox ready"
    };

    this.cartridge=null

    this.activityGUID="";

    this.onLaunch=this.onLaunch.bind(this);
    this.onNonce=this.onNonce.bind(this);
    this.onActivityID=this.onActivityID.bind(this);
    this.onCustomFields=this.onCustomFields.bind(this);

    this.onChangeFirstnameValue=this.onChangeFirstnameValue.bind(this);
    this.onChangeLastnameValue=this.onChangeLastnameValue.bind(this);
    this.onChangeEmailValue=this.onChangeEmailValue.bind(this);
    this.handleSecretChange=this.handleSecretChange.bind(this);
    this.handleKeyChange=this.handleKeyChange.bind(this);
    this.handleNonceChange=this.handleNonceChange.bind(this);
    this.handleActivityChange=this.handleActivityChange.bind(this);
    this.handleURLChange=this.handleURLChange.bind(this);
    this.handleCartridgeChange=this.handleCartridgeChange.bind(this);

    this.onChangeRoleValue = this.onChangeRoleValue.bind(this);
  }
 
  /**
   * 
   */
  setStatus (aMessage) {
    this.setState ({statusMessage: aMessage});
  }

  /**
   * https://github.com/bettiolo/oauth-signature-js
   */
  generateSignature (url,key,secret,nonce,timestamp) {
    console.log ("generateSignature ()");
  
    var httpMethod = 'GET';
    var url = url;
    var parameters = {
      oauth_consumer_key : key,
      oauth_nonce : nonce,
      oauth_timestamp : timestamp,
      oauth_signature_method : 'HMAC-SHA1',
      oauth_version : '1.0'
    };

    var signature = oauthSignature.generate('GET', url, parameters, secret, "", { encodeSignature: false});  

    // generates a BASE64 encode HMAC-SHA1 hash
    //signature = oauth.generate('GET', url, parameters, secret, "", { encodeSignature: false});  

    return (signature);
  }

  /**
   *
   */
  validateData () {
    console.log ("validateData ()");

    this.setStatus ("");

    console.log (this.state);

    if (this.state.ltiURL=="") {
      alert ("Please provide either a launch URL or a cartridge containing a url");
      return (false);
    }

    if (this.state.ltiURL.indexOf ("https://")==-1) {
      this.setStatus ("A url that uses http instead of https might not work in certain browsers");
    }

    if (this.state.ltiFirstname=="") {
      alert ("Please provide a first name");
      return (false);
    }

    if (this.state.ltiLastname=="") {
      alert ("Please provide a last name");
      return (false);
    }

    if (this.state.ltiEmail=="") {
      alert ("Please provide an andrew id or email");
      return (false);
    }

    return (true);
  }

  /**
   *
   */
  loadLTIPage () {
    console.log ("loadLTIPage ()");

    if (this.validateData ()==false) {
      return;
    }

    var now=Date.now();

    var signature=this.generateSignature (this.ltiURL,this.ltiKey,this.ltiSecret,this.state.nonce,now);

    console.log ("Signature: " + signature);

    var roleString="urn:lti:instrole:ims/lis/Student";
    
    if (this.state.ltiRole=="instructor") {
      roleString="urn:lti:instrole:ims/lis/Instructor";
    }

    $("input[type='hidden']").remove();

    var ltiFields = { 
      oauth_consumer_key: this.state.ltiKey,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: now,
      oauth_nonce: this.state.nonce,
      oauth_version: "1.0",
      context_id: this.state.ltiActivityID,
      context_label: "EBERLYLTI",
      context_title: this.state.ltiTitle,
      ext_ims_lis_basic_outcome_url: "javascript:window.parentgradePassbackReceiver",
      ext_lti_assignment_id: this.state.ltiActivityID,
      ext_outcome_data_values_accepted: "url,text",
      ext_outcome_result_total_score_accepted: false,
      ext_outcome_submission_submitted_at_accepted: false,
      ext_outcomes_tool_placement_url: "javascript:window.parent.outcomesToolePlacemenReceiver",
      ext_roles: roleString,
      launch_presentation_document_target: "iframe",
      launch_presentation_locale: "en",
      launch_presentation_return_url: "javascript:window.parent.launchPresentationReceiver",
      lis_outcome_service_url: "javascript:window.parent.outcomesReceiver",
      lis_person_name_family: this.state.ltiLastname,
      lis_person_name_full: (this.state.ltiFirstname + " " + this.state.ltiLastname),
      lis_person_name_given: this.state.ltiFirstname,
      lti_message_type: "basic-lti-launch-request",
      lti_version: "LTI-1p0",
      oauth_callback: "about:blank",
      resource_link_id: this.state.ltiActivityID,
      resource_link_title: this.state.ltiTitle,
      roles: roleString,
      tool_consumer_info_product_family_code: "eberly",
      tool_consumer_info_version: "cloud",
      tool_consumer_instance_contact_email: "eberly-assist@andrew.cmu.edu",
      tool_consumer_instance_guid: (this.uuidv4()+":canvas-lms"),
      tool_consumer_instance_name: "Carnegie Mellon University",
      user_id: this.state.ltiEmail,
      oauth_signature: signature,
      custom_canvas_assignment_title: this.state.ltiTitle
    };

    console.log ("Loading target page: " + this.state.ltiURL);

    for (let key in ltiFields) {
      if (ltiFields.hasOwnProperty(key)) {
        console.log(key + " -> " + ltiFields[key]);

        $('<input>').attr({
          type: 'hidden',
          id: key,
          name: key,
          value: ltiFields [key]
        }).appendTo('#ltirelayform');
      }
    }

    $("#ltirelayform").attr("action",this.state.ltiURL);

    document.getElementById('ltirelayform').submit();
  }  

  /**
   *
   */
  onLaunch () {
    console.log ("onLaunch ()");

    if (this.state.ltiURL.length==0) {
      console.log ("No URL provided, attempting to load cartridge ...");
        
      if (this.state.ltiCartridge=="")  {
        alert ("Please provide either a launch url or an LTI cartridge");
        return;
      }


      let doc=this.xmlParser.parseXML (this.state.ltiCartridge);
      let children=this.xmlParser.getElementChildren (data);
      let url="";
      let title="";

      for (let i=0;i<children.length;i++) {
        
        if (this.xmlParser.getElementName (children [i])=="blti:launch_url") {
          url=this.xmlParser.getNodeTextValue (children [i]);
        }

        if (this.xmlParser.getElementName (children [i])=="blti:title") {
          title=this.xmlParser.getNodeTextValue (children [i]);
        }          
      }

      this.setState ({
        ltiTitle: title,
        ltiURL: url
      },(e) => {
        this.loadLTIPage ();  
      });
    } else {    
      console.log ("URL provided, skipping cartridge configuration: " + this.state.ltiURL);

      this.loadLTIPage ();
    }
  }

  /**
   *
   */
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   *
   */
  onActivityID () {
    console.log ("onActivityID ()");

    this.setState ({ltiActivityID: this.uuidv4()});
  }

  /**
   *
   */
  onNonce () {
    console.log ("onNonce ()");

    this.setState ({nonce: this.uuidv4()});
  }

  /**
   *
   */
  handleSecretChange(event) {
    this.setState({ltiSecret: event.target.value});
  }  

  /**
   *
   */
  handleKeyChange(event) {
    this.setState({ltiKey: event.target.value});
  }  

  /**
   *
   */
  handleNonceChange(event) {
    this.setState({nonce: event.target.value});
  }   

  /**
   *
   */
  handleActivityChange(event) {
    this.setState({ltiActivityID: event.target.value});
  }

  /**
   *
   */
  handleURLChange(event) {
    this.setState({ltiURL: event.target.value});
  }

  /**
   *
   */
  handleCartridgeChange(event) {
    this.setState({ltiCartridge: event.target.value});
  }

  /**
   *
   */
  onChangeFirstnameValue(event) {
    this.setState({ltiFirstname: event.target.value});
  }

  /**
   *
   */
  onChangeLastnameValue(event) {
    this.setState({ltiLastname: event.target.value});
  }

  /**
   *
   */
  onChangeEmailValue(event) {
    this.setState({ltiEmail: event.target.value});
  }    

  /**
   *
   */
  onChangeRoleValue(event) {
    console.log("onChangeRoleValue (" + event.target.value + ")");

    this.setState ({
      ltiRole: event.target.value
    });
  }

  /**
   *
   */
  onCustomFields () {
    console.log ("onCustomFields ()");

  }

  /**
   *
   */
  render() {
     return (
        <div className="maincontainer">
          <div className="canvasmenu"><img src={canvasMockMenu} /></div>     
          <div className="canvasbanner"><a href="https://cmu.edu/teaching" className="eberlyurl">Eberly Canvas LTI Simulator</a></div>
    		  <div className="verticalcontainer">
    		    <div className="controls">
              
              <div className="controlpanel borderRight" style={{minWidth: "281px", flex: "0"}}>
                <div className="row">
                  <label htmlFor="first">First Name:</label>
                  <input className="canvas-textinput" type="text" id="first" name="first" onChange={this.onChangeFirstnameValue} />
                </div>

                <div className="row">
                  <label htmlFor="last">Last Name:</label>
                  <input className="canvas-textinput" type="text" id="last" name="last" onChange={this.onChangeLastnameValue} />
                </div>

                <div className="row">
                  <label htmlFor="email">Email / Andrew ID:</label>
                  <input className="canvas-textinput" type="text" id="email" name="email" onChange={this.onChangeEmailValue} />
                </div>

                <div className="row" >
                  <input type="radio" value="student" name="role" checked={this.state.ltiRole === 'student'} onChange={this.onChangeRoleValue} /> Student
                  <input type="radio" value="instructor" name="role" checked={this.state.ltiRole === 'instructor'} onChange={this.onChangeRoleValue} /> Instructor
                </div>

                <button className="canvas-button" onClick={this.onCustomFields}>Custom Fields</button>
              </div>

              <div className="controlpanel borderRight" style={{minWidth: "308px", flex: "0"}}>
                <div className="row">
                  <label htmlFor="secret">Secret:</label>
                  <input className="canvas-textinput" type="text" id="secret" name="secret" value={this.state.ltiSecret} onChange={this.handleSecretChange}/><br />
                </div>

                <div className="row">
                  <label htmlFor="key">Key:</label>
                  <input className="canvas-textinput" type="text" id="key" name="key" value={this.state.ltiKey} onChange={this.handleKeyChange} /><br />
                </div>

                <div className="row">
                  <label htmlFor="nonce">Nonce:</label>
                  <input className="canvas-textinput" type="text" id="nonce" name="nonce" value={this.state.nonce} onChange={this.handleNonceChange} />
                  <button className="canvas-button" onClick={this.onNonce}>Generate</button>
                </div>

                <div className="row">  
                  <label htmlFor="activityid">Activity ID:</label>
                  <input className="canvas-textinput" type="text" id="activityid" name="activityid" value={this.state.ltiActivityID} onChange={this.handleActivityChange} />
                  <button className="canvas-button" onClick={this.onActivityID}>Generate</button>
                </div>
              </div>                

              <div className="controlpanel borderRight" style={{borderRight: "0px"}}>
                <div className="row">
                  <label htmlFor="url">Launch URL:</label>
                  <input className="canvas-textinput" type="text" id="url" name="url" value={this.state.ltiURL} onChange={this.handleURLChange} />
                  <button className="canvas-button" onClick={this.onLaunch}>Launch</button>
                  <br />
                </div> 
 
                <div className="row">
                  <label htmlFor="cartridge">LTI Cartridge:</label><br />
                  <textarea id="cartridge" name="cartridge" className="cartridge" value={this.state.ltiCartridge} onChange={this.handleCartridgeChange} />
                </div>
              </div> 

    		    </div>
    		    <div className="iframe">
    		      <iframe id="lticontent" name="lticontent" width="100%" height="100%" frameBorder="0" src=""></iframe>
              <form id="ltirelayform" target="lticontent" method="post"></form>
    		    </div>

            <div id="statusbar" className="statusbar">{this.state.statusMessage}</div>
    		  </div>		  
        </div>
     );
  }
}
