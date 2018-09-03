function show_user_profile(obj) {
	document.body.innerHTML = 'Welcome '
	+ obj.name
	+ '! <br><br> Your email: '
	+ obj.email;
}