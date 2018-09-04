// sending login data to server
function login() {
	const obj = {
		"email"		: document.getElementById('login-email').value,
		"password"	: document.getElementById('login-password').value
	};
	if (!validator.isEmail(obj.email)) {
		document.getElementById('login-error').innerHTML = 'wrong email';
	} else if (!validator.isAlphanumeric(obj.password)) {
		document.getElementById('login-error').innerHTML = 'wrong password';
	} else {
		socket.emit('login', obj);
	};
};

// logging out
function logout() {
	socket.emit('logout');
};

var login_form = '<div id="login-div">'
		+ '<h4>LOGIN</h4>'
		+ 'Email<input id="login-email" type="email">'
		+ '<br>'
		+ '<br>'
		+ 'Password<input id="login-password" type="password">'
		+ '<br>'
		+ '<br>'
		+ '<button id="login-submit-btn" onclick="login()">Login</button>'
		+ '<p id="login-error"></p>'
	+ '</div>';