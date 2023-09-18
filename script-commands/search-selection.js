#!/usr/bin/env osascript -l JavaScript

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Search Selection
// @raycast.mode compact

// Optional parameters:
// @raycast.icon 🔍

// Documentation:
// @raycast.author Cheng Jianhua
// @raycast.authorURL https://github.com/chengjianhua


ObjC.import('AppKit');

var app = Application.currentApplication();
app.includeStandardAdditions = true;

var frontmostApp = Application('System Events').processes.whose({ frontmost: true }).name()[0];

var selection = copySelection(frontmostApp, 1)

var url = "https://www.google.com/search?q=" + encodeURIComponent(selection)

app.doShellScript('open ' + url);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function copySelection(pAppName, pTimeLimitSec) {
  //---------------------------------------------------------------------------------
  /*  VER: 1.1.1     DATE: 2016-06-18
  
  PARAMETERS:
    •  pAppName  : Name of App in which to copy selection
        • IF pAppName is invalid, script will stop with error msg
    • pTimeLimitSec    :  Max number of seconds to wait for App Copy to complete
                          • usually 2-3 sec is adequate
                          • If you are expecting a short text selection and
                            possibly no selection, then 1 sec should work
    
  RETURNS:
    •  Items that were selected in the App (text, rich text, images, etc)
    • IF no selection was made, an empty string is returned
    
  PURPOSE:    Copy Selection to Clipboard, & Return Value
  
  AUTHOR:  JMichaelTX (in most forums)
             Find any bugs/issues or have suggestions for improvement?
             Contact me via PM or at blog.jmichaeltx.com/contact/
             
  CHANGE LOG:
  
    1.1.1  2016-06-18    ADD Parameter for pTimeLimitSec
    1.1    2016-06-17    ADD timeout loop to wait for App to complete copy
    1.0    2016-06-17    First Release
    
  REF:     https://github.com/dtinth/JXA-Cookbook/wiki/System-Events
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  */
  'use strict';


  //--- GET A REF TO CURRENT APP WITH STD ADDITONS ---
  var app = Application.currentApplication()
  app.includeStandardAdditions = true
  var seApp = Application('System Events')

  //--- Set the Clipboard so we can test for no selection ---
  app.setTheClipboardTo("[NONE]")

  //--- Activate the App to COPY the Selection ---
  try {
    var activeApp = Application(pAppName)
  }
  catch (e) {
    throw (new Error("Invalid Application Name: " + pAppName));
  }
  activeApp.activate()
  delay(0.2)  // adjust the delay as needed

  //--- Issue the COPY Command ---
  seApp.keystroke('c', { using: 'command down' }) // Press ⌘C 

  //--- LOOP UNTIL TIMEOUT TO PROVIDE TIME FOR APP TO COMPLETE COPY ---

  var startTime = new Date().getTime()  // number of milliseconds since 1970/01/01
  var timeLimitMs = pTimeLimitSec * 1000.0
  var clipContents = ""

  while ((new Date().getTime() - startTime) < timeLimitMs) {
    delay(0.2)  // adjust the delay as needed

    //--- Get the content on the Clipboard ---
    clipContents = app.theClipboard()
    //console.log(clipContents)

    if (clipContents !== "[NONE]") break;

  } // END WHILE waiting for copy to complete

  //--- Display Alert if NO Selection was Made ---
  if (clipContents === "[NONE]") {
    clipContents = ""
    var msgStr = "App: " + pAppName
    //  console.log(msgStr)
    app.displayNotification(
      msgStr,
      {
        withTitle: ("Copy Selection"),
        subtitle: "NO SELECTION was made!",
        soundName: "Glass.aiff"
      })
  }  // END IF (clipContents === "[NONE]")

  return clipContents
} // END function copySelection()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
