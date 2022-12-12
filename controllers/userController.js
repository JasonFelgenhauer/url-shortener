const { catchAsync } = require('../utils/functions');
const jwt = require('jsonwebtoken');

const authenticate = catchAsync(async (req, res, next) => {
	const token = req.cookies.jwt;
	if (!token) {
		return res.status(401).json({ error: 'No token, authorization denied' });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ error: 'Token is not valid' });
		}
		req.user = user;
		next();
	});
});

const needAuthentication = catchAsync(async (req, res, next) => {
	if (!req.cookies.jwt) {
		return res.redirect('/');
	} else {
		next();
	}
});

const noAthentication = catchAsync(async (req, res, next) => {
	if (req.cookies.jwt) {
		return res.redirect('/');
	} else {
		next();
	}
});

module.exports = {
	authenticate,
	needAuthentication,
	noAthentication,
};
