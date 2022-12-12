const { catchAsync, checkCookie } = require('../utils/functions');
const Link = require('../models/Link');
const jwt = require('jsonwebtoken');

const index = catchAsync((req, res) => {
	const cookie = checkCookie(req);
	res.render('index', { title: 'Home', success: req.flash('success'), errors: req.flash('error'), cookie });
});

const login = catchAsync((req, res) => {
	const cookie = checkCookie(req);
	res.render('login', { title: 'Login', errors: req.flash('error'), cookie });
});

const register = catchAsync((req, res) => {
	const cookie = checkCookie(req);
	res.render('register', { title: 'Register', errors: req.flash('error'), cookie });
});

const logout = catchAsync(async (req, res) => {
	res.clearCookie('jwt');
	res.clearCookie('user');
	res.redirect('/');
});

const history = catchAsync(async (req, res) => {
	const cookie = checkCookie(req);
	const decodeToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
	const id = decodeToken.id;

	const links = await Link.find({ user: id });

	res.render('history', { title: 'History', cookie, links });
});

const deleteLink = catchAsync(async (req, res) => {
	const code = req.params.id;
	const decodeToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
	const userId = decodeToken.id;
	const link = await Link.findOne({ code: code, user: userId });

	if (link) {
		await Link.deleteOne({ code: code, user: userId });
		res.redirect('/history');
	} else {
		res.redirect('/history');
	}
});

const redirect = catchAsync(async (req, res) => {
	const code = req.params.id;
	const link = await Link.findOne({ code: code });

	if (link) {
		res.redirect(link.link);
	} else {
		res.redirect('/');
	}
});

module.exports = {
	index,
	login,
	register,
	logout,
	history,
	deleteLink,
	redirect,
};
