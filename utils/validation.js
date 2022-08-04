const joi = require('joi');

const registerValidation = (body) => {
	const registerValidationSchema = joi.object({
		register_pseudo: joi.string().min(2).max(20).trim().required(),
		register_email: joi.string().min(6).max(255).trim().required().email(),
		register_password: joi.string().min(8).max(255).required(),
		register_password_confirm: joi.ref('register_password'),
	});

	return registerValidationSchema.validate(body);
};

const loginValidation = (body) => {
	const loginValidationSchema = joi.object({
		login_email: joi.string().min(6).max(255).trim().required().email(),
		login_password: joi.string().min(8).max(255).required(),
	});

	return loginValidationSchema.validate(body);
};

const urlValidation = (body) => {
	const urlValidationSchema = joi.object({
		long_url: joi.string().min(6).trim().required(),
	});

	return urlValidationSchema.validate(body);
};

module.exports = {
	registerValidation,
	loginValidation,
	urlValidation,
};
