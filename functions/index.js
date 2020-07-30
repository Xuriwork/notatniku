const functions = require('firebase-functions');
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')();
const { validateFirebaseIdToken } = require('./utils/middleware');

const app = express();

app.use(cors({ origin: true }));
app.use(cookieParser);
app.use(express.urlencoded({ extended: true }));

const visionClient = new vision.ImageAnnotatorClient({
	keyFilename: './utils/keyfile.json',
	projectId: 'notatniku'
});

const storage = new Storage();

const deleteBucket = async (folderName) => {
	await storage.bucket('notatniku_ocr').deleteFiles({
		prefix: `${folderName}/`
	})
};

const postImage = async (req, res) => {
	const filePath = req.body.filePath;
	const [result] = await visionClient.textDetection(`gs://notatniku_ocr/${filePath}`);
	const fullTextAnnotation = result.fullTextAnnotation;
	const text = fullTextAnnotation.text;
	await res.status(201).json({ text });
	const folderName = filePath.split('/')[0];
	deleteBucket(folderName);
};

app.post('/convert-image-to-text', validateFirebaseIdToken, postImage);

exports.api = functions.https.onRequest(app);