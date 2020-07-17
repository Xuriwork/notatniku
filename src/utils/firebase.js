import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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

export const auth = firebase.auth();
export const db = firebase.firestore();
export const usersCollection = db.collection('users');

export default firebase;