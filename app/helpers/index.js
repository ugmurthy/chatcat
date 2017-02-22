'use strict';
const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');



// iterate through routes to mount the routes
	let _registerRoutes = (routes,method) => {
		for (let key in routes) {
			//console.log(key," -> ",routes[key]);		
			if (typeof routes[key] === 'object' && routes[key] != null && !(routes[key] instanceof Array)) {
					// at this stage key is equivalent to method
					// and routes[key] is equivalent to {'route':function}
					_registerRoutes(routes[key], key);
			} else {
				if (method === 'get') {
	//				console.log("GET:",key,routes[key]);
					router.get(key,routes[key])
				} else  if (method === 'post') {
	//				console.log("POST:",key,routes[key]);
					router.post(key, routes[key]);
				} else {  // neighter a get or a post - could be middleware or other
					router.use(routes[key]);
				}
				
			}
		}
	}

	let route = routes => {
		_registerRoutes(routes);
		return router;
	}

	//find a single user based on a key
	let findOne = profileID => {
		return db.userModel.findOne({'profileId':profileID})
	}

	let createNewUser = profile => {
		return new Promise((resolve,reject) => {
			console.log("progile.id : ",profile.id);
			console.log("profile.DN : ",profile.displayName);

			let newChatUser = new db.userModel({
				profileId: profile.id,
				fullName: profile.displayName,
				profilePic: profile.photos[0].value || "/img/user.jpg"
			});
			newChatUser.save(error => {
				if (error) {
					reject(error);
				} else {
					resolve(newChatUser);
				}
			});
		});
	}

	// the ES6 promisified version of the findById
	let findById = id => {
		return new Promise((resolve,reject) => {
			db.userModel.findById(id, (error,user) => {
				if (error) {
					reject(error);
				} else {
					resolve(user);
				}
			});
		});
	}

	let isAuthenticated = (req,res,next) => {
		if(req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/');
		}
	}

	// find room by name
	let findRoomByName = (allrooms, room) => {
		let findRoom = allrooms.findIndex((element,index,array) => {
			if (element.room === room) {
				return true;
			} else {
				return false;
			}
		});
		return findRoom > -1 ? true: false;
	}
	
	// generate a unique room ID
	let randomHex = () => {
		return crypto.randomBytes(24).toString('hex');
	}

	// find room by ID
	let findRoomById = (allrooms, roomID) => {
		return allrooms.find((element, index, array) => {
			if (element.roomID === roomID) {
				return true;
			} else {
				return false;
			}
		});
	}

	// add user to room
	let addUserToRoom = (allrooms,data,socket) => {
		// get the room object
		let getRoom = findRoomById(allrooms,data.roomID);
		if (getRoom !== undefined) {
			// get the active user's ID (objectID as used in session)
			let userID = socket.request.session.passport.user;
			// check to s ee if this user already exists in the chatroom
			let checkUser = getRoom.users.findIndex((element,index,array)=>{
				if (element.userID === userID) {
					return true;
				} else {
					return false;
				}
			});
			// if user already present in room, remove him first
			if (checkUser >-1) {
				getRoom.users.splice(checkUser,1);
			}
			// Push the user into the room's users array
			getRoom.users.push({
				socketID : socket.id,
				userID,
				user: data.user,
				userPic: data.userPic
			})
			// Join the room channel
			socket.join(data.roomID);

			// Return the update room 
			return getRoom;
		}
	}

	module.exports = {
		// ES6 allow use of 'name' instead of 'name:name'
		route,
		findOne,
		createNewUser,
		findById,
		isAuthenticated,
		findRoomByName,
		findRoomById,
		randomHex,
		addUserToRoom
	}

















