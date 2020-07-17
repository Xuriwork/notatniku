const admin = require('firebase-admin');
const firebase = require('firebase');

admin.initializeApp();

const db = admin.firestore();

firebase.initializeApp({
	apiKey: 'AIzaSyAvfq_Zu_dmsuoikc2TSLNZ-rUhzUOpvsE',
	authDomain: 'notatniku.firebaseapp.com',
	databaseURL: 'https://notatniku.firebaseio.com',
	projectId: 'notatniku',
	storageBucket: 'notatniku.appspot.com',
});

module.exports = { admin, db, firebase };