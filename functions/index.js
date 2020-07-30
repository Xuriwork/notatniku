const functions = require('firebase-functions');
const vision = require('@google-cloud/vision');
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

const postImage = async (req, res) => {
	const filePath = req.body.filePath;
	const [result] = await visionClient.textDetection(`gs://notatniku_ocr/${filePath}`);
	const fullTextAnnotation = result.fullTextAnnotation;
	const text = fullTextAnnotation.text;
	res.status(201).json({ text });
};

app.post('/convert-image-to-text', validateFirebaseIdToken, postImage);

exports.api = functions.https.onRequest(app);