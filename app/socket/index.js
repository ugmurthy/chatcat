'use strict'
const h = require('../helpers');

module.exports = (io,app) => {

	let allrooms = app.locals.chatrooms;

	io.of('/roomslist').on('connection',socket => {
		//console.log("socket.io connected to CLIENT");
		//console.log("allrooms : " ,JSON.stringify(allrooms));

		//socket.on('Hi', () => {
		//	console.log("Server Detected Hi event emitted from client")
		//	socket.emit("Bye","ByeBye!");
		//});

		socket.on('getChatRooms', () => {
		//	console.log("Server detected getChatRooms event at Client");
			socket.emit('chatRoomsList', JSON.stringify(allrooms));		
		});

		socket.on('createNewRoom', newRoomInput => {
			
			// check to see if room exists else create one and broadcast it to all
			if (!h.findRoomByName(allrooms, newRoomInput)) {
				// create room
				allrooms.push({
					room: newRoomInput,
					roomID: h.randomHex(),
					users: []
				});
				console.log("Creating Room: ",newRoomInput);
				
				// Emit an updates list to the creator
				socket.emit('chatRoomsList', JSON.stringify(allrooms));
				// emit updated list to all
				socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));

			}
		});

	});

	io.of('/chatter').on('connection', socket => {
		// Join a chat room
		socket.on('join', data => {
			//console.log(data);
			let usersList = h.addUserToRoom(allrooms,data,socket);
			console.log('usersList',usersList["users"]);
			//socket.broadcast.to(data.roomID).emit('updateUsersList',JSON.stringify(usersList.users));
			//socket.emit('updateUsersList',JSON.stringify(usersList.users));
		});
	});
}

	




















