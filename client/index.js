socket.on('login-error', function(msg) {
	document.getElementById('login-error').innerHTML = msg;
});

// show user profile page if user was logged in successfuly
socket.on('login-success', function(msg) {
	show_user_profile(msg);
});

socket.on('registration-error', function(msg) {
	document.getElementById('registration-error').innerHTML = msg;
});

// show user profile page if user registration was successful
socket.on('registration-success', function(msg) {
	show_user_profile(msg);
});

// show user profile page if session continues
socket.on('user-logged-in', function(msg) {
	show_user_profile(msg);
});

// show page with user login and registration forms
socket.on('new-session', function() {
	document.body.innerHTML = login_form + registration_form;
});


