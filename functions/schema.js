//const functions = require('firebase-functions');

//const loveYouFormsUtil = require('loveyouforms-util');
//const logErrorInfo = error => loveYouFormsUtil.logErrorInfo(error);

/*------------------------------------------------------------------------------
  Doc-Schema Trigger Cloud Functions
  When a new 'doc' is created this adds default fields/schema to it
  Parameters: 'col' is collection type and 'schema' is from 'global' collection
 ------------------------------------------------------------------------------*/

const schemaDefault = (functions, db, logErrorInfo, col, schema) => functions.firestore.document(`${col}/{id}`)
 .onCreate(async (snapshot, context) => {

 try {

   // Get Default Schema
   const schemaRef = await db.collection('global').doc(schema).get();
   const schemaData = schemaRef.data();

   // Update new doc with default schema
   const appRef = db.collection(col).doc(context.params.id);
   appRef.set(schemaData); // update record with 'set' which is for existing doc

 } catch(error) {
   
   console.error(logErrorInfo(error));

 }

});

// Default schema functions for 'app' and 'formTemplate' collections
//exports.schemaApp = schemaDefault('app', 'schemaApp');
//exports.schemaFormTemplate = schemaDefault('formTemplate', 'schemaFormTemplate');

module.exports = {
  schemaDefault
}
