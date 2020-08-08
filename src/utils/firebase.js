import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
	apiKey: "AIzaSyAvfq_Zu_dmsuoikc2TSLNZ-rUhzUOpvsE",
	authDomain: "notatniku.firebaseapp.com",
	databaseURL: "https://notatniku.firebaseio.com",
	projectId: "notatniku",
	storageBucket: "notatniku.appspot.com",
	messagingSenderId: "521875161904",
	appId: "1:521875161904:web:2e7f545b7466e00decfef5",
	measurementId: "G-2FFW3G51FX"
};

firebase.initializeApp(firebaseConfig);

firebase.firestore().enablePersistence()
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
		alert('Multiple tabs open, persistence can only be enabled, in one tab at a time.');
      } else if (err.code == 'unimplemented') {
		alert('This browser does not support all of the features required to enable persistencee');
      }
  });

export const auth = firebase.auth();
export const db = firebase.firestore();
export const usersCollection = db.collection('users');

export default firebase;