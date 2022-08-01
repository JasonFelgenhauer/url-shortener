const catchAsync = require('../helpers/catchAsync');

const index = catchAsync((req, res) => {
	res.render('index', { title: 'Home' });
});

module.exports = {
	index,
};
