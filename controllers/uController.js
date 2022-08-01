const catchAsync = require('../helpers/catchAsync');

const index = catchAsync((req, res) => {
	res.render('index', { title: 'Home' });
});

const why = catchAsync((req, res) => {
	res.render('why', { title: 'Why' });
});

module.exports = {
	index,
	why,
};
