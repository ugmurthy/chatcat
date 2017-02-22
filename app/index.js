'use strict';

// Social Authentication logic
require('./auth')();


// create a i/o server instanace
let ioServer = app => {
    ///////////////////////////
	// app.local namespace allow defining app level variables
	// in memory locals will be available throuhout the app and from the req stream
	// but not scalable. may need a db solution.
	app.locals.chatrooms = [];
	///////////////////////////
	const server = require('http').Server(app);
	const io = require('socket.io')(server);
	
	// see session 62 lecture 6 : Bridging socket io with session
	// session data can be accessed only via request stream and the way to access that 
	// is via socket middleware
	// socket middleware helps access the active user's profile 
	// from within socket.io 
	// the profile is stored in the session when the user is logged in
	// socket.request contains every thing related to the incoming messages
	io.use((socket, next) => {
		require('./session')(socket.request,{},next); 
		// no response as of now therefore {}

	});
	require('./socket')(io, app);
	return(server)
}


module.exports = {
	router: require('./routes')(),
	session: require('./session'),
	ioServer
}
