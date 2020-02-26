// SECTION Requirements

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
var admin = require("firebase-admin");
var serviceAccount = require("./service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sheet-sync-fd542.firebaseio.com"
});
// Firestore db reference
let db = admin.firestore();
// Required for timestamps settings
let FieldValue = require('firebase-admin').firestore.FieldValue; // Timestamp Here
const settings = { timestampsInSnapshots: true};
// Timestamp conversions
let moment = require('moment-timezone');
db.settings(settings);
// Google Sheets instance
const { google } = require("googleapis");
const sheets = google.sheets("v4");
// Create JWT Authentication
const jwtClient = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"] // read and write sheets
});

// !SECTION


// ANCHOR Form Handler
exports.formHandler = functions.https.onRequest(async (req, res) => {

  // Form submitted data
  let { app: appKey, template = 'contactDefault', webformId, ...rest } 
    = req.body; // template default 'contactForm' if not added in webform

  // Sanitize data
  let sanitizedData = {};
  function sanitize(string, charCount) { return string.trim().substr(0, charCount) };

  let formFields = await db.collection('formField').get();
  for (const doc of formFields.docs) {
    let maxLength = await doc.data().maxLength;
    // ...rest -> first check if field exists in req.body ...rest
    if (rest[doc.id]) {
      let string = sanitize(rest[doc.id], maxLength);
      sanitizedData[doc.id] = string;
    } else if (doc.id == 'appKey') {
      appKey = sanitize(appKey, maxLength);
    } else if (doc.id == 'template') {
      template = sanitize(template, maxLength);
    } else if (doc.id == 'webformId') {
      webformId = sanitize(webformId, maxLength);
    }
  }
  console.log("sanitizedData $$$$$$$$$$$$$$$$$$ ", sanitizedData);

  // App identifying info
  let appInfoName, appInfoUrl, appInfoFrom;
  const appInfoRef = db.collection('app').doc(appKey);
  await appInfoRef.get()
    .then(doc => {
      if (!doc.exists) {
        res.end();
      } else {
        // destructure from doc.data().appInfo --> name, url, from 
        // and assign to previously declared vars
        ( { name: appInfoName, url: appInfoUrl, from: appInfoFrom } 
           = doc.data().appInfo );
        sanitizedData.appInfoName = appInfoName;
        sanitizedData.appInfoUrl = appInfoUrl;
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

  // Build object to be saved to db
  let data = {
    // spread operator conditionally adds, otherwise function errors if not exist
    // 'from' email if not assigned comes from firebase extension field: DEFAULT_FROM
    appKey,
    createdDateTime: FieldValue.serverTimestamp(),
    ...appInfoFrom && { from: appInfoFrom }, // from: app.(appKey).appInfo.from
    toUids: [ appKey ], // to: app.(appKey).email
    ...sanitizedData.email && {replyTo: sanitizedData.email}, // webform
    ...webformId && { webformId }, // webform
    template: {
      name: template,
      data: sanitizedData
    }
  };

  // So serverTimestamp works must first create new doc key then post data
  let newKey = db.collection("formSubmission").doc();
  // update the new-key-record using 'set' which works for existing doc
  newKey.set(data);

  return res.send({
    // return empty success response, so client can finish AJAX success
  });

});


// ANCHOR - Firestore To Sheets [Nested email template data]
exports.firestoreToSheet = functions.firestore.document('formSubmission/{formId}').onCreate(async () => {
  
  let templateData = {}; // will contain data row to be submitted to sheet
  let emailTemplateName;
  let emailTemplateData;
  let appKeySubmitted; // use in submit data
  let spreadsheetId; // use in both try and catch so declare here
  let sheetId;

  try {
    /**
    * Prepare Data Row 
    */

    // Get last form submission 
    const formSubmission = await db.collection('formSubmission')
      .orderBy('createdDateTime', 'desc').limit(1).get();
      formSubmission.docs.map(doc => {
        // doc.data() is object -> { name: 'jax', email: 'jax@jax.com' }
        let { appKey, createdDateTime, template: { data: { ...rest }, name: templateName  }, webformId } = doc.data(); 
        // For building sort-ordered object that is turned into sheet data-row
        emailTemplateName = templateName;
        emailTemplateData = rest;
        // appkey to query 'spreadsheet' object info
        appKeySubmitted = appKey;
        // date and time
        // FIXME get timezone from 'app' config so will post to excel
        const created = createdDateTime.toDate(); // toDate() is firebase method
        const createdDate = moment(created).tz("America/New_York").format('L'); // Format date with moment.js
        const createdTime = moment(created).tz("America/New_York").format('h:mm A z');
        // Add date-time to start of data object
        templateData.createdDate = createdDate;
        templateData.createdTime = createdTime;
        // Add webformId to data object
        templateData.webformId = webformId;
        return;
      });

    // Get emailTemplate fields by sort-order
    await db.collection('emailTemplate').doc(emailTemplateName).get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such email template name!');
        } else {
          doc.data().templateData.map(f => {
            return templateData[f] = ""; // add prop name + empty string value
          });
        }
      })
      .catch(err => {
        console.log('Error getting email template name!', err);
      });
      
    // Update templateData{} sort-ordered emailTemplate props with data values
    Object.assign(templateData, emailTemplateData);
    // Object to array because valueArray needs to contain another array
    templateData = Object.values(templateData);
    // Sheets Row Data to add ... valueArray: [[ date, time, ... ]]
    const valueArray = [( templateData )];

    /**
    * Submit Data Row to app-specific spreadsheet
    */

    // Get app spreadsheetId and formSubmission's emailTemplate sheetId
    await db.collection('app').doc(appKeySubmitted).get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such email template name!');
        } else {
          spreadsheetId = doc.data().spreadsheet.id;
          sheetId = doc.data().spreadsheet.sheetId[emailTemplateName];
        }
      })
      .catch(err => {
        console.log('Error getting email template name!', err);
      });

    // Authorize with google sheets
    await jwtClient.authorize();
    
    // Insert blank row
    const insertBlankRowAfterHeader = {
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [
          // following requires "..." otherwise function error
          {
            "insertDimension": {
              "range": {
                "sheetId": sheetId,
                "dimension": "ROWS",
                "startIndex": 1,
                "endIndex": 2
              },
              "inheritFromBefore": false
            }
          }
        ]
      }
    };

    // Add row data
    const addRowDataAfterHeader = {
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      range: `${emailTemplateName}!A2`, // e.g. "contactDefault!A2"
      valueInputOption: "RAW",
      requestBody: {
        values: valueArray
      }
    };

    // Check for Sheet name
    let exists = {
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      range: "default!A1:Z1"
    };
    let sheetExists = (await sheets.spreadsheets.values.get(exists)).data;
    console.log("Sheet Exists ##### ", sheetExists);

    // Update Google Sheets Data
    await sheets.spreadsheets.batchUpdate(insertBlankRowAfterHeader);
    await sheets.spreadsheets.values.update(addRowDataAfterHeader);

  }
  catch(err) {
    // errors in 'errors' object, then map through errors array check for .message prop
    console.log("err $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ", err);
    const errorMessage = err.errors.map(e => e.message);
    console.log("Error Message: ############# ", errorMessage);
    // If true --> create sheet 
    if (errorMessage[0].includes("Unable to parse range:")) {

      const addSheet = {
        auth: jwtClient,
        spreadsheetId: spreadsheetId,
        resource: {
          requests: [
            // following requires "..." otherwise function error
            {
              "addSheet": {
                "properties": {
                  "title": "Default",
                  "gridProperties": {
                    "rowCount": 1000,
                    "columnCount": 26
                  },
                }
              } 
            }
          ]
        }
      };

      // newSheet returns 'data' object with properties:
      // spreadsheetId
      // replies[0].addSheet.properties (sheetId, title, index, sheetType, gridProperties { rowCount, columnCount }
      let newSheet = await sheets.spreadsheets.batchUpdate(addSheet);
      // add newSheet data to object
      let newSheetProps = {};
      newSheetProps.spreadsheetId = newSheet.data.spreadsheetId;
      newSheet.data.replies.map(reply => newSheetProps.addSheet = reply.addSheet); 
      console.log("newSheetProps $$$$$$$$$ ", newSheetProps);
      let newSheetId = newSheetProps.addSheet.properties.sheetId;
      console.log("newSheetId $$$$$$$$$$$$ ", newSheetId);
    }

  }

});


// ANCHOR Firebase to Sheets [Basic 2 Column List]
exports.firebaseToSheet = functions.database.ref("/Form").onUpdate(async change => {
  let data = change.after.val();
  console.log("data ################ ", data);
  // Convert JSON to Array following structure below
  //
  //[
  //  ['COL-A', 'COL-B'],
  //  ['COL-A', 'COL-B']
  //]
  //
  var itemArray = [];
  var valueArray = [];
  Object.keys(data).forEach((key, index) => {
    itemArray.push(key);
    itemArray.push(data[key]);
    console.log("itemArray ############################# ", itemArray);
    valueArray[index] = itemArray;
    itemArray = [];
  });

  let maxRange = valueArray.length + 1;

  // Do authorization
  await jwtClient.authorize();
  console.log("valueArray ############################# ", valueArray) 

  // Create Google Sheets request
  let request = {
    auth: jwtClient,
    spreadsheetId: "1nOzYKj0Gr1zJPsZv-GhF00hUAJ2sTsCosMk4edJJ9nU",
    range: "Firebase!A2:B" + maxRange,
    valueInputOption: "RAW",
    requestBody: {
      values: valueArray
    }
  };
  
  // Update data to Google Sheets
  await sheets.spreadsheets.values.update(request, {});
});

