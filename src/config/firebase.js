require('dotenv').config()
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL
});

// Truy xuất database (Realtime Database hoặc Firestore)
const db = admin.database(); //  dùng cho Realtime Database

module.exports = { admin, db };