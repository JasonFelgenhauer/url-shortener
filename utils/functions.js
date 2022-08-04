const catchAsync = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch((err) => {
			next(err);
		});
	};
};

const makeId = () => {
	let txt = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	for (let i = 0; i < 6; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return txt;
};

const checkCookie = (req) => {
	let cookie = false;
	if (req.cookies.jwt) {
		cookie = true;
	}
	return cookie;
};

module.exports = {
	catchAsync,
	makeId,
	checkCookie,
};
