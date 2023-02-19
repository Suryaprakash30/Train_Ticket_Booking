const users = [];
const logEmail = document.getElementById("logEmail");
const logPassword = document.getElementById("logPassword");
const logIn = document.getElementById("login");
const configureValue = {
	bookingLimit: 10,
	rowCount: 5,
};

function restoreFromLocalStorage() {
	const user = JSON.parse(localStorage.getItem('users'));
	if(user) {
		users.push(...user);
	}
}

if(!localStorage.getItem('configureValue')) {
	localStorage.setItem('configureValue', JSON.stringify(configureValue));
}

logIn.onclick = (e) => {
	const user = users.find(user => user.email == logEmail.value);
	if(logEmail.value === "admin@gmail.com") {
		if(logPassword.value === "admin") {
			e.preventDefault();
			window.location.href = "admin.html";
			} else {
			logPassword.setCustomValidity('Password did not match');
		}
	}
	else if(user) {
		if(logPassword.value == user.password) {
			if(user.phone) {
				e.preventDefault();
				window.location.href = `dashboard.html?id=${user.id}`;	
				} else {
				//e.preventDefault();
				window.location.href = `accountdetails.html?id=${user.id}`;
			}
			} else {
			logPassword.setCustomValidity('Password did not match');
		}
		} else {
		logEmail.setCustomValidity('Email not found');
	}
}

restoreFromLocalStorage();	