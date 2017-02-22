'use strict'

const passport = require('passport');
const config = require('../config');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const h = require('../helpers');


module.exports = () => {
	passport.serializeUser((user,done) =>{
		done(null,user.id);
	});

	passport.deserializeUser((id,done)=>{
		// find the user by id
		h.findById(id)
			.then(user => done(null,user))
			.catch(error => console.log("Error when deserializing user"));
	});
	let authProcessor = (accesstoken,refreshToken,profile,done) => {
		// Find a user profile in lcal db using profile.id
		// if the user is found, return the user data using done()
		// if the user is not found, create one in local db and return
		h.findOne(profile.id)
			.then(result => {
				if (result) {
					done(null,result);
				} else {
					// Create a new user and return ; i.e registration
					h.createNewUser(profile)
						.then(createNewUser => done(null, createNewUser))
						.catch(error => console.log('Error creating new user'));
				}
			});

	}
	passport.use(new FacebookStrategy(config.fb,authProcessor));

	// note: in case of twitter, which uses oauth 1.0, the 
	// accesstoken and refreshtoken in authprocessor are
	// token and tokentsecret respectively which are recevied from twitter
	passport.use(new TwitterStrategy(config.twitter,authProcessor));

}