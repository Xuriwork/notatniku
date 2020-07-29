const cookieParser = require('cookie-parser')();
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const vision = require('@google-cloud/vision');

const { validateFirebaseIdToken } = require('./utils/middleware.js');

const app = express();
app.use(cors({ origin: true }));
app.use(cookieParser);

const convertImageToText = async (imageFile) => {
	const client = new vision.ImageAnnotatorClient();
	const [result] = await client.documentTextDetection(imageFile);
	const fullTextAnnotation = result.fullTextAnnotation;
	return fullTextAnnotation.text;
};

const postImage = async (req, res) => {
	const image = await req.body.image;
	const text = convertImageToText(image).catch((error) => {
        functions.logger.log("There was an error", error);
		return res.status(500).send(error);
	});
	return res.status(201).json({ text });
};

app.post('/convert-image-to-text', validateFirebaseIdToken, postImage);

exports.api = functions.https.onRequest(app);
