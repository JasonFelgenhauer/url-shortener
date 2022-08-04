const { Schema, model } = require('mongoose');

const linkSchema = new Schema({
	link: { type: String, required: true },
	shortLink: { type: String, required: true },
	code: { type: String, required: true, unique: true },
	user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Link', linkSchema);
