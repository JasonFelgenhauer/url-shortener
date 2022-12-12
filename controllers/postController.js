const { catchAsync, makeId, checkCookie } = require('../utils/functions');
const jwt = require('jsonwebtoken');
const validation = require('../utils/validation');
const User = require('../models/User');
const Link = require('../models/Link');
const bcrypt = require('bcrypt');
require('dotenv').config();

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
		const cookie = checkCookie(req);
		return res.status(400).render('login', { title: 'Login', errors: 'Incorrect email or password.', cookie });
	}

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1800s' });
	res.cookie('jwt', token, {
		expires: new Date(Date.now() + 2600000),
		httpOnly: true,
		secure: 'production',
	});
	res.redirect('/');
});

const indexPost = catchAsync(async (req, res) => {
	const longUrl = req.body.long_url;

	const { error } = validation.urlValidation(req.body);

	if (error != undefined) {
		req.flash('error', error.details[0].message);
		return res.redirect('/');
	}

	const id = makeId();
	const shortUrl = `url-shortener.jason-fel.be/${id}`;

	const linkExist = await Link.findOne({ code: id });
	if (linkExist) {
		req.flash('error', 'This link already exist');
		return res.redirect('/');
	}

	if (req.cookies.jwt) {
		const decodeToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
		const user = decodeToken.id;
		await Link.create({
			link: longUrl,
			shortLink: shortUrl,
			code: id,
			user: user,
		});

		req.flash('success', shortUrl);
		return res.redirect('/');
	} else {
		await Link.create({
			link: longUrl,
			shortLink: shortUrl,
			code: id,
			user: null,
		});

		req.flash('success', shortUrl);
		return res.redirect('/');
	}
});
const registerPost = catchAsync(async (req, res) => {
	const pseudo = req.body.register_pseudo;
	const email = req.body.register_email;
	const password = req.body.register_password;
	const passwordConfirm = req.body.register_password_confirm;

	const { error } = validation.registerValidation(req.body);
	const cookie = checkCookie(req);

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
			return res.render('login', { title: 'Login', success: 'Account created', errors: req.flash('error'), cookie });
		}
	}
});

module.exports = {
	loginPost,
	indexPost,
	registerPost,
};
