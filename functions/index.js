//initialize firebase with .json file with API keys-------------------------
const admin = require('firebase-admin'); //give access directly to GODMODE
const serviceAccount = require('./service_account.json');

const functions = require('firebase-functions');
const createUser = require('./create_user');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
//--------------------------

exports.createUser = functions.https.onRequest(createUser);
