// user profile page
function show_user_profile(obj) {
	document.body.innerHTML = '<div id="user-profile-div">Welcome <b>'
	+ obj.name
	+ '</b> ! <br><br> Your email: <b>'
	+ obj.email
	+ '</b> <br><br> <button id="logout-submit-btn" onclick="logout()">Logout</button>'
	+ '</div>';
};