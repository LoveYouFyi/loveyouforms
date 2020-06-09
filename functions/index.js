/*------------------------------------------------------------------------------
  LoveYouForms is a cloud app that handles form submissions for one website 
  or 1,000 using the Firebase platform, Google Sheets Sync, and SMTP Email API.
  IMPORTANT: for database setup follow the instructions at loveyouforms.com 
------------------------------------------------------------------------------*/
//const loveyouforms = require('loveyouforms');
const loveyouforms = require('there');

/*------------------------------------------------------------------------------
  Form-Handler HTTP Firebase Cloud Function
  Handles data sent by html form submission, validates allowed form fields and 
  creates Firestore database entry with the allowed fields.
------------------------------------------------------------------------------*/
exports.formHandler = loveyouforms.formHandler;

/*------------------------------------------------------------------------------
  Firestore-to-Sheets Trigger Firebase Cloud Function
  Syncs Firestore database 'submitForm' entries to google sheets.
  If html form does not have matching sheet, creates new sheet/tab & row header.
------------------------------------------------------------------------------*/
exports.firestoreToSheets = loveyouforms.firestoreToSheets;

/*------------------------------------------------------------------------------
  Doc-Schema Trigger Firebase Cloud Functions
  When Firestore database 'doc' of collection type 'app' or 'formTemplate' is 
  created, this adds default fields/schema to it. 
------------------------------------------------------------------------------*/
exports.schemaApp = loveyouforms.schemaApp;
exports.schemaFormTemplate = loveyouforms.schemaFormTemplate;