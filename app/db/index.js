'use strict';
const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);

// Log and error if connection fails
Mongoose.connection.on('error',error => {
	console.log("MongoDB Error", error);
});

// create a schema that defines the structure for storing user data
const chatUser = new Mongoose.Schema({
	profileId: String,
	fullName: String,
	profilePic: String
});
// Turn the Schema to a usable model which will allow user to store the documents in the collection
let userModel = Mongoose.model('chatUser',chatUser);


module.exports = {
	Mongoose,
	userModel
}

