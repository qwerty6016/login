'use strict';

const express = require('express')
const app	  = express();
const http	  = require('http').Server(app);
const io	  = require('socket.io')(http);
const path	  = require('path');
const PORT	  = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'client')));
const db = require('./server/db');

http.listen(PORT, function() {
	console.log('listening on port: ' + PORT);
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', function(socket) {
	
	console.log('a user connected');
	
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	
	socket.on('login', function(obj) {
		if (!validate(obj.email)) {
			io.sockets.to(socket.id).emit('login-error', 'wrong email');
		} else if (!obj.password) {
			io.sockets.to(socket.id).emit('login-error', 'wrong password');
		} else {
			Promise.resolve(db.login_user(obj))
			.then(function(result){
				if (result.success === true) {
					console.log('user logged in successfully');
					io.sockets.to(socket.id).emit('login-success', result);
				} else {
					io.sockets.to(socket.id).emit('login-error', result.success);
				};
			});
		};
	});
	
	socket.on('registration', function(obj) {
		if (!validate(obj.email)) {
			io.sockets.to(socket.id).emit('registration-error', 'wrong email');
		} else if (!obj.name) {
			io.sockets.to(socket.id).emit('registration-error', 'wrong name');
		} else if (!obj.password) {
			io.sockets.to(socket.id).emit('registration-error', 'wrong password');
		} else {
			Promise.resolve(db.register_user(obj))
			.then(function(result){
				if (result.success === true) {
					console.log('user registered successfully');
					io.sockets.to(socket.id).emit('registration-success', result);
				} else {
					io.sockets.to(socket.id).emit('registration-error', result.success);
				};
			});
		};
	});
	
});

function validate(string) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(string);
};