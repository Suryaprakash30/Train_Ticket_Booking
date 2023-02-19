let users = [];
const form = document.querySelector(".form");
const dob = document.getElementById("dob");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const image = document.getElementById("image");
const submit = document.getElementById("submit");
const url = document.URL;
const agentId = url.substring(url.lastIndexOf('=') + 1);

function restoreFromLocalStorage() {
	const user = JSON.parse(localStorage.getItem('users'));
	if(user) {
		users.push(...user);
	}
}

restoreFromLocalStorage();

const user = users.find(user => user.id == agentId);

if(user) {
	if(user.phone) {
		form.firstElementChild.remove();
		form.innerHTML = `<h2>You already entered your details</h2>
		<center><h3><a href="dashboard.html?id=${agentId}">Continue</a></h3></center>`;
	}
	} else {
	form.firstElementChild.remove();
	form.innerHTML = `<h2>You are not authorized to view this page</h2>`;
}

submit.onclick = (e) => {
	let imageFile = image.files[0];
	if(imageFile) {
		e.preventDefault();
		let reader = new FileReader();
		reader.readAsDataURL(imageFile);
		reader.addEventListener('load', () => {
			user.dob = dob.value;
			user.phone = phone.value;
			user.address = address.value;
			user.photo = reader.result;
			localStorage.setItem('users', JSON.stringify(users));
			window.location.href = `dashboard.html?id=${agentId}`;
		});
	}
};