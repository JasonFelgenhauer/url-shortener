const catchAsync = require('../helpers/catchAsync');

const index = catchAsync((req, res) => {
	res.render('index', { title: 'Home' });
});

const why = catchAsync((req, res) => {
	res.render('why', { title: 'Why' });
});

const login = catchAsync((req, res) => {
	res.render('login', { title: 'Login' });
});

const register = catchAsync((req, res) => {
	res.render('register', { title: 'Register' });
});

module.exports = {
	index,
	why,
	login,
	register,
};
