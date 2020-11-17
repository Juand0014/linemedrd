const { Schema, model } = require('mongoose');

/*
Consultorios (ID, Nombre, Dirección).
*/

const consultSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	dir: String
});

module.exports = model('Consult', consultSchema);
