'use strict';

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../config');
const db = require('../db');


if (process.env.NODE_ENV === 'production') {
	// Initial session with setting for production
	module.exports = session ({
		secret: config.sessionSecret,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection: db.Mongoose.connection
		})
	})
} else {
	// Initialise session with settings for dev 
	module.exports = session ({
		secret: config.sessionSecret,
		resave: false,
		saveUninitialized: true
	})
}