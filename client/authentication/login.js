
function login() {
	const obj = {
		"email"		: document.getElementById('login-email').value,
		"password"	: document.getElementById('login-password').value
	};
	if (!validate(obj.email)) {
		document.getElementById('login-error').innerHTML = 'wrong email';
	} else {
		socket.emit('login', obj);
	};
};

socket.on('login-error', function(msg) {
	document.getElementById('login-error').innerHTML = msg;
});

socket.on('login-success', function(msg) {
	show_user_profile(msg);
});