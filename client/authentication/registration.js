
function registration() {
	const obj = {
		"name"		: document.getElementById('registration-name').value,
		"email"		: document.getElementById('registration-email').value,
		"password"	: document.getElementById('registration-password').value
	};
	if (!validate(obj.email)) {
		document.getElementById('registration-error').innerHTML = 'wrong email';
	} else {
		socket.emit('registration', obj);
	};
};

socket.on('registration-error', function(msg) {
	document.getElementById('registration-error').innerHTML = msg;
});

socket.on('registration-success', function(msg) {
	show_user_profile(msg);
});