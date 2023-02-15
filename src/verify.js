let users = [];
const pass = document.getElementById("password");
const rePass = document.getElementById("repassword");
const verify = document.getElementById("verify");
const toolTip1 = document.getElementsByClassName("tooltiptext")[0];
const toolTip2 = document.getElementsByClassName("tooltiptext")[1];
const form = document.querySelector(".form");
const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
const url = document.URL;
const agentId = url.substring(url.lastIndexOf('=')+1);

function matchPassword() {
	if(!pass.value.match(validPassword)) {
		toolTip1.style.visibility = "visible";
		} else {
		toolTip1.style.visibility = "hidden";
	}
}

function matchRePass() {
	if(pass.value.length > 0 && rePass.value === pass.value) {
		toolTip2.style.visibility = "hidden";
		} else {
		toolTip2.style.visibility = "visible";
	}
}

function restoreFromLocalStorage() {
	const user = JSON.parse(localStorage.getItem('users'));
	if(user) {
		users.push(...user);
	}
}	

restoreFromLocalStorage();

const user = users.find(user => user.id == agentId);

if(user) {
	if(user.password) {
		form.firstElementChild.remove();
		form.innerHTML = `<h2>You are already verified</h2>
		<center><h3><a href="index.html">Login here</a></h3></center>`;
	}
	} else {
	form.firstElementChild.remove();
	form.innerHTML = `<h2>You are not authorized to view this page</h2>`;
}

verify.onclick = (e) => {
	if(pass.value.match(validPassword)) {
		if(rePass.value === pass.value) {
			e.preventDefault();
			user.password = pass.value;
			localStorage.setItem('users', JSON.stringify(users));
			alert("Verified Successfully");
			window.location.href = "index.html";
			} else {
			rePass.setCustomValidity('Password did not match');
		}
		} else {
		pass.setCustomValidity('Match the format');
	}
};