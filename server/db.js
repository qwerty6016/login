'use strict';

const crypto = require('crypto');
const pgp = require('pg-promise')(/*options*/);
const db = pgp(process.env.DATABASE_URL);
const secret = 'abcdefg';

exports.login_user = function(obj) { 
	console.log('logging in user...');
	return db.any('SELECT name, password FROM users WHERE email = $1', obj.email)
	.then(function (data) {
		var result = {};
		
		// if user with this email is found in database
		if(data[0]) {
			
			// decrypting password
			const crypto = require('crypto');
			const decipher = crypto.createDecipher('aes192', secret);
			const encrypted = data[0].password;
			var decrypted_password = decipher.update(encrypted, 'hex', 'utf8');
			decrypted_password += decipher.final('utf8');
			
			// if password from user matches password in database
			if (decrypted_password == obj.password) {
				result.success 	= true;
				result.name		= data[0].name;
				result.email	= obj.email;
				return result;
			} else {
				console.log('wrong password');
				result.success 	= false;
				result.error 	= 'wrong password';
				return result;
			};
		} else {
			console.log('wrong email');
			result.success = false;
			result.error = 'wrong email';
			return result;
		};
	})
	.catch(function (error) {
		console.log('ERROR:', error);
		var result = {};
		result.success 	= false;
		result.error	= "server error logging in user";
		return result;
	});
};

exports.register_user = function(obj) {
	console.log('registering new user...');
	
	// encrypting password
	const crypto = require('crypto');
	const cipher = crypto.createCipher('aes192', secret);
	var encrypted = cipher.update(obj.password, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	obj.password = encrypted;
	
	return db.one('INSERT INTO users(email, name, password) VALUES($1, $2, $3) RETURNING id', [obj.email, obj.name, obj.password])
	.then(function (data) {
		var result = {};
		console.log('user registered successfully, id:', data.id);
		result.success 	= true;
		result.name		= obj.name;
		result.email	= obj.email;
		return result;
	})
	.catch(function (error) {
		console.log('ERROR:', error);
		var result = {};
		result.success 	= false;
		result.error	= "server error registering user";
		return result;
	});
};
