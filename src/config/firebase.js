require('dotenv').config()
var admin = require("firebase-admin");

var serviceAccount = {
  "type": "service_account",
  "project_id": "travel-app-437bb",
  "private_key_id": process.env.FB_API_KEY,
  "private_key": process.env.FB_PRIVATE_KEY,
  "client_email": "firebase-adminsdk-fbsvc@travel-app-437bb.iam.gserviceaccount.com",
  "client_id": "115118472550133979069",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40travel-app-437bb.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL
});

// Truy xuất database (Realtime Database hoặc Firestore)
const db = admin.database(); //  dùng cho Realtime Database

module.exports = { admin, db };