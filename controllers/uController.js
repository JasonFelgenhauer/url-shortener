const catchAsync = require('../helpers/catchAsync');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const index = catchAsync((req, res) => {
	res.render('index', { title: 'Home' });
});

const why = catchAsync((req, res) => {
	res.render('why', { title: 'Why' });
});

const login = catchAsync((req, res) => {
	res.render('login', { title: 'Login', errors: req.flash('error') });
});

const register = catchAsync((req, res) => {
	res.render('register', { title: 'Register', errors: req.flash('error') });
});

const registerPost = catchAsync(async (req, res) => {
	const pseudo = req.body.register_pseudo;
	const email = req.body.register_email;
	const password = req.body.register_password;
	const passwordConfirm = req.body.register_password_confirm;

	if (pseudo.length == 0 || email.length == 0 || password.length == 0 || passwordConfirm.length == 0) {
		req.flash('error', 'All fields are required');
		return res.redirect('/register');
	}

	if (pseudo.length > 20) {
		req.flash('error', 'Pseudo must be less than 20 characters');
		return res.redirect('/register');
	}

	if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
		req.flash('error', 'Invalid email');
		return res.redirect('/register');
	}

	if (password != passwordConfirm) {
		req.flash('error', 'Passwords do not match');
		return res.redirect('/register');
	}

	if (password.match(/^.{8,}$/)) {
		if (password.match(/[A-Z]+/)) {
			if (password.match(/\d+/)) {
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
			} else {
				req.flash('errors', 'Password must contain at least one number');
				res.redirect('/register');
			}
		} else {
			req.flash('error', 'Your password must have at least one capital letter');
			res.redirect('/register');
		}
	} else {
		req.flash('error', 'Your password must be at least 8 characters long');
		return res.redirect('/register');
	}

	res.render('register', { title: 'Register', errors: req.flash('error') });
});

module.exports = {
	index,
	why,
	login,
	register,
	registerPost,
};
