// sending registration data to server
function registration() {
	const obj = {
		"name"		: document.getElementById('registration-name').value,
		"email"		: document.getElementById('registration-email').value,
		"password"	: document.getElementById('registration-password').value
	};
	if (!validator.isEmail(obj.email)) {
		document.getElementById('registration-error').innerHTML = 'such email address is not supported';
	} else if (!validator.isAlphanumeric(obj.password)) {
		document.getElementById('registration-error').innerHTML = 'password must contain only <br> english letters and numbers';
	} else if (!validator.isAlphanumeric(obj.name)) {
		document.getElementById('registration-error').innerHTML = 'name must contain only <br> english letters and numbers';
	} else {
		socket.emit('registration', obj);
	};
};

var registration_form = '<div id="registration-div">'
		+ '<h4>REGISTRATION</h4>'
		+ 'Name <input id="registration-name" type="text">'
		+ '<br>'
		+ '<br>'
		+ 'Email <input id="registration-email" type="email">'
		+ '<br>'
		+ '<br>'
		+ 'Password <input id="registration-password" type="password">'
		+ '<br>'
		+ '<br>'
		+ '<button id="registration-submit-btn" onclick="registration()">Register User</button>'
		+ '<p id="registration-error"></p>'
	+ '</div>';