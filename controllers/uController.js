const { catchAsync, makeId, checkCookie } = require('../utils/functions');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Link = require('../models/Link');
const validation = require('../utils/validation');

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

const index = catchAsync((req, res) => {
	const cookie = checkCookie(req);
	res.render('index', { title: 'Home', success: req.flash('success'), errors: req.flash('error'), cookie });
});

const indexPost = catchAsync(async (req, res) => {
	const longUrl = req.body.long_url;

	const { error } = validation.urlValidation(req.body);

	if (error != undefined) {
		req.flash('error', error.details[0].message);
		return res.redirect('/');
	}

	const id = makeId();
	const shortUrl = `${req.headers.host}/${id}`;

	const linkExist = await Link.findOne({ code: id });
	if (linkExist) {
		req.flash('error', 'This link already exist');
		return res.redirect('/');
	}

	if (req.cookies.user) {
		const user = req.cookies.user._id;
		const link = await Link.create({
			link: longUrl,
			shortLink: shortUrl,
			code: id,
			user: user,
		});

		req.flash('success', shortUrl);
		return res.redirect('/');
	} else {
		const link = await Link.create({
			link: longUrl,
			shortLink: shortUrl,
			code: id,
			user: null,
		});

		req.flash('success', shortUrl);
		return res.redirect('/');
	}

	res.redirect('/');
});

const why = catchAsync((req, res) => {
	const cookie = checkCookie(req);
	res.render('why', { title: 'Why', cookie });
});

const login = catchAsync((req, res) => {
	const cookie = checkCookie(req);
	res.render('login', { title: 'Login', errors: req.flash('error'), cookie });
});

const register = catchAsync((req, res) => {
	const cookie = checkCookie(req);
	res.render('register', { title: 'Register', errors: req.flash('error'), cookie });
});

const registerPost = catchAsync(async (req, res) => {
	const pseudo = req.body.register_pseudo;
	const email = req.body.register_email;
	const password = req.body.register_password;
	const passwordConfirm = req.body.register_password_confirm;

	const { error } = validation.registerValidation(req.body);

	if (password != passwordConfirm) {
		req.flash('error', 'Passwords do not match');
		return res.redirect('/register');
	}

	if (error != undefined) {
		req.flash('error', error.details[0].message);
		return res.redirect('/register');
	} else {
		let user = await User.findOne({ email: email });
		if (user) {
			req.flash('error', 'Email already used');
			return res.redirect('/register');
		} else {
			user = new User({
				name: pseudo,
				email: email,
				password: password,
				isAdmin: false,
			});
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();
			res.render('login', { title: 'Login', success: 'Account created' });
		}
	}

	res.render('register', { title: 'Register', errors: req.flash('error') });
});

const loginPost = catchAsync(async (req, res) => {
	const email = req.body.login_email;
	const password = req.body.login_password;

	const { error } = validation.loginValidation(req.body);

	if (error != undefined) {
		req.flash('error', error.details[0].message);
		return res.redirect('/login');
	}

	let user = await User.findOne({ email: email });
	if (!user) {
		return res.status(400).render('login', { title: 'Login', errors: 'Incorrect email or password.' });
	}

	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword) {
		return res.status(400).render('login', { title: 'Login', errors: 'Incorrect email or password.' });
	}

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1800s' });
	res.cookie('jwt', token, {
		expires: new Date(Date.now() + 2600000),
		httpOnly: true,
		secure: 'production',
	});
	res.cookie('user', user, {
		expires: new Date(Date.now() + 2600000),
		httpOnly: true,
		secure: 'production',
	});
	res.redirect('/');
});

const logout = catchAsync(async (req, res) => {
	res.clearCookie('jwt');
	res.clearCookie('user');
	res.redirect('/');
});

const history = catchAsync(async (req, res) => {
	const cookie = checkCookie(req);
	const id = req.cookies.user._id;

	const links = await Link.find({ user: id });

	res.render('history', { title: 'History', cookie, links });
});

const deleteLink = catchAsync(async (req, res) => {
	const code = req.params.id;
	const userId = req.cookies.user._id;
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
	indexPost,
	why,
	login,
	register,
	registerPost,
	loginPost,
	authenticate,
	needAuthentication,
	logout,
	history,
	deleteLink,
	noAthentication,
	redirect,
};
