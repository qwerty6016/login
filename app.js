'use strict';

const express	 = require('express');
const app	 	 = express();
const http		 = require('http').Server(app);
const io	 	 = require('socket.io')(http);
const path		 = require('path');
const validator	 = require('validator');
const PORT	 	 = process.env.PORT || 3000;
var session	 	 = require('express-session');

app.use(session({
	secret : 's3Cur3',
	cookie : { secure: true },
	name : 'sessionId'
}));

// to use session in websockets
session.user = {};

app.use(express.static(path.join(__dirname, 'client')));

const db = require('./server/db');

http.listen(PORT, function() {
	console.log('listening on port: ' + PORT);
});

/**
 * if user was logged out from websockets context,
 * log out user from express-session context;
 * if user still logged in (from websockets point of view),
 * send index.html page
*/
app.get('/', function(req, res) {
	if (session.user.logged_in === false) {
		delete session.user.logged_in;
		req.session.destroy();
		res.redirect('/');
	} else {
		res.sendFile(__dirname + '/client/index.html');
	};
});

io.on('connection', function(socket) {
	
	console.log('a user connected');
	
	/**
	 * if user is logged in, but websockets 
	 * connection was lost (for example page was refreshed)
	 * session will be continued,
	 * if user is not logged in, it will be a new session
	*/
	if (session.user.logged_in) {
		io.sockets.to(socket.id).emit('user-logged-in', session.user);
	} else {
		io.sockets.to(socket.id).emit('new-session');
	};
	
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	
	socket.on('login', function(obj) {
		if (!session.user.logged_in) {
			if (!validator.isEmail(obj.email)) {
				io.sockets.to(socket.id).emit('login-error', 'wrong email');
			} else if (!validator.isAlphanumeric(obj.password)) {
				io.sockets.to(socket.id).emit('login-error', 'wrong password');
			} else {
				Promise.resolve(db.login_user(obj))
				.then(function(result){
					if (result.success === true) {
						session.user.logged_in 	= result.success;
						session.user.name 		= result.name;
						session.user.email		= result.email;
						console.log('user logged in successfully');
						io.sockets.to(socket.id).emit('login-success', result);
					} else {
						io.sockets.to(socket.id).emit('login-error', result.error);
					};
				});
			};
		} else {
			io.sockets.to(socket.id).emit('user already logged in');
		};
	});
	
	// logout and start new session (from websockets point of view)
	socket.on('logout', function() {
		session.user.logged_in = false;
		io.sockets.to(socket.id).emit('new-session');
	});
	
	socket.on('registration', function(obj) {
		if (!validator.isEmail(obj.email)) {
			io.sockets.to(socket.id).emit('registration-error', 'such email address is not supported');
		} else if (!validator.isAlphanumeric(obj.name)) {
			io.sockets.to(socket.id).emit('registration-error', 'name must contain only <br> english letters and numbers');
		} else if (!validator.isAlphanumeric(obj.password)) {
			io.sockets.to(socket.id).emit('registration-error', 'password must contain only <br> english letters and numbers');
		} else {
			Promise.resolve(db.register_user(obj))
			.then(function(result){
				if (result.success === true) {
					session.user.logged_in 	= result.success;
					session.user.name 		= result.name;
					session.user.email		= result.email;
					console.log('user registered successfully');
					io.sockets.to(socket.id).emit('registration-success', result);
				} else {
					io.sockets.to(socket.id).emit('registration-error', result.error);
				};
			});
		};
	});
});