const { db } = require('./utils/admin');
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const uniqid = require('uniqid');
const slugify = require('slugify');

const app = express();
app.use(cors({ origin: true }));

const usersCollection = db.collection('users');

exports.onUserCreated = functions.auth.user().onCreate((user) => {
	const email = user.email;
	const userId = user.uid;
	const dateCreated = new Date();

	const userInfo = {
		userId,
		email,
		dateCreated,
		bookmarks: [],
	};
	db.collection('users')
		.doc(userId)
		.set(userInfo)
		.catch((error) => res.status(500).send(error.message));
});

const getUserData = async (req, res) => {
	const userId = req.params.userId;

	const notebooksRef = await usersCollection
		.doc(userId)
		.collection('notebooks')
		.get();

	const bookmarks = await usersCollection
		.doc(userId)
		.get()
		.then((doc) => {
			const _bookmarks = doc.data().bookmarks;
			return _bookmarks;
		});


	const trashRef = await usersCollection
		.doc(userId)
		.collection('trash')
		.get();

	const notebooks = notebooksRef.empty
		? []
		: notebooksRef.docs.map((doc) => Object.assign(doc.data(), { id: doc.id }));

	const trash = trashRef.empty
		? []
		: trashRef.docs.map((doc) => Object.assign(doc.data(), { id: doc.id }));

	res.send({ notebooks, bookmarks, trash });
};

const getNotebookPage = async (req, res) => {
	const notebookId = req.params.notebookId;
	const userId = req.params.userId;

	console.log('req.params', req.params);

	const notebookPagesRef = await usersCollection
	.doc(userId)
	.collection('notebooks')
	.doc(notebookId)
	.collection('pages')
	.get()

	const notebookPages = notebookPagesRef.empty
		? []
		: notebookPagesRef.docs.map((doc) => Object.assign(doc.data(), { id: doc.id }));
	
	res.send({ pages: notebookPages });
};

const handleCreateNotebook = async (req, res) => {
	const notebookName = req.body.notebookName;
	const userId = req.body.userId;
	
	const slugifiedNotebookName = slugify(notebookName, { lower: true });
	const dateCreated = new Date();

	const notebookId = `${slugifiedNotebookName}-${uniqid()}`;

	usersCollection.doc(userId).collection('notebooks').doc(notebookId).set({
		name: notebookName,
		notebookId,
		dateCreated
	});
};

app.get('/user/:userId', getUserData);
app.post('/create-notebook', handleCreateNotebook);
app.get('/notebook/:notebookId', getNotebookPage);

exports.api = functions.https.onRequest(app);
