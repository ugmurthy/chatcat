'use strict'

const passport=require('passport');
const h = require('../helpers');
const config = require('../config');

module.exports = () => {
	
	let routes = {
		
		'get' : {
			'/' : (req,res,next) => {
				res.render('login');
			},
			'/login' : (req,res,next) => {
				res.render('login');
			},
			'/rooms': [h.isAuthenticated, (req,res,next) => {
				res.render('rooms',{
					user: req.user,
					host: config.host
				});
			}],
			'/chat/:id': [h.isAuthenticated , (req,res,next) => {
				// find a chatroom with a give id
				// render if id found
				let getRoom = h.findRoomById(req.app.locals.chatrooms, req.params.id);
				if (getRoom === undefined) { 
					// room does not exist
					return next(); // skip to next route, will end up in 404
				} else {
					// room exists
					res.render('chatroom',{
						user: req.user,
						host: config.host,
						room: getRoom.room,
						roomID: getRoom.roomID
					});
				}
				
			}],
			'/auth/facebook': passport.authenticate('facebook'),
			'/auth/facebook/callback': passport.authenticate('facebook',{
				successRedirect: '/rooms',
				failureRedirect: '/'
			}),
			'/auth/twitter': passport.authenticate('twitter'),
			'/auth/twitter/callback': passport.authenticate('twitter',{
				successRedirect: '/rooms',
				failureRedirect: '/'
			}),
			'/logout': (req,res,next) => {
				    	req.session.destroy((err) => {
							if (err) {
								console.log("Error destroying session: ",err)
							} else {
								req.logout();
								console.log("logging out...");
								res.redirect('/');
							}
						});
						console.log("sending status 401");
						res.status(401);
			}
		},
		
		'post': {

		},
		'NA':(req,res,next) => {  // should be the last function...for 404
			res.status(404).sendFile(process.cwd()+'/views/404.htm')
		}
	}

	//for (let key in routes) {
	//	console.log(key," -> ",routes[key]);
	//}
	
	return h.route(routes);
}
