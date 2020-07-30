const admin = require('firebase-admin');

admin.initializeApp();

exports.validateFirebaseIdToken = async (req, res, next) => {
	console.log('Check if request is authorized with Firebase ID token');

	if (
		(!req.headers.authorization ||
			!req.headers.authorization.startsWith('Bearer ')) &&
		!(req.cookies && req.cookies.__session)
	) {
		console.error(
			'No Firebase ID token was passed as a Bearer token in the Authorization header.',
			'Make sure you authorize your request by providing the following HTTP header:',
			'Authorization: Bearer <Firebase ID Token>',
			'or by passing a "__session" cookie.'
		);
		res.status(403).send('Unauthorized');
		return;
	}

	let idToken;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		idToken = req.headers.authorization.split('Bearer ')[1];
	} else if (req.cookies) idToken = req.cookies.__session;
	else {
		res.status(403).send('Unauthorized');
		return;
	}

	try {
		const decodedIdToken = await admin.auth().verifyIdToken(idToken);
		req.user = decodedIdToken;
		next();
		return;
	} catch (error) {
		res.status(403).send('Unauthorized');
		return;
	}
};