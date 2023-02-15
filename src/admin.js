let count = 1;
let users = [];
let configureValue = JSON.parse(localStorage.getItem("configureValue"));
const url = document.URL;
const header = url.substring(0,url.lastIndexOf('/')+1);
const name = document.getElementById("name");
const email = document.getElementById("email");
const validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const addAgent = document.getElementById("addAgent");
const delTable = document.getElementById("delTable");
const seatCount = document.getElementById("seatCount");
const compartment = document.getElementById("compartment");
const configure = document.getElementById("configure");
const addUser = document.querySelector(".addUser");
const delUser = document.querySelector(".delUser");
const config = document.querySelector(".config");
const addUserModal = document.getElementById("addUserModal");
const delUserModal = document.getElementById("delUserModal");
const configModal = document.getElementById("configModal");
const closeModals = document.querySelectorAll(".close");
const openModals = [[addUser,addUserModal], [delUser,delUserModal], [config,configModal]];
const daylink = Array.from(document.querySelectorAll(".daylink"));
const gridTable = document.querySelector("#gridTable");

function saveToLocalStorage() {
	localStorage.setItem('users', JSON.stringify(users));
}

function restoreFromLocalStorage() {
	const user = JSON.parse(localStorage.getItem('users'));
	if(user) {
		users.push(...user);
		delTable.dispatchEvent(new CustomEvent('agentUpdated'));
	}
}

function sendEmail(id) {
	emailjs.init("aIkO1mowbsi1X9VYI");
	emailjs.send("service_lqyb3jp", "template_icofl5l", {to_email: email.value, to_name: name.value, message_html: `${header}verify.html?id=${id}`})
	.then(function(response) {
		console.log("Email successfully sent!");
		}, function(error) {
		console.log("Error sending email:", error);
	});
}

function displayAgent() {
	const html = users.map(user => `<tr>
		<td>${user.name}</td>
		<td>${user.email}</td>
		<td class="delIcon" id="${user.id}">&#10006</td>
	</tr>`).join('');
	delTable.innerHTML = html;
}

function deleteAgent(id) {
	users = users.filter(user => user.id != id);
	delTable.dispatchEvent(new CustomEvent('agentUpdated'));
}

function displaySeats(a) {
	let count = 1;
	const date = a;
	document.querySelector(".active").classList.remove("active");
	document.getElementById(a).parentElement.classList.add("active");
	const tBody = document.querySelector("#gridTable tbody");
	if(tBody) tBody.remove();
	for (var r = 0; r < configureValue.rowCount; r++) {
		var insertRowInTable = gridTable.insertRow(r);
		for (var c = 0; c < 7; c++) {
			insertRowInTable.insertCell(c);
			const currentCell = gridTable.rows[r].cells[c];
			if(c == 3) {
				currentCell.style.width = "15px";
				} else {
				currentCell.id = count;
				currentCell.classList.add("seat", "seatAvailable");
				currentCell.innerText = count;
				count++;
			}
		}
	}
}

addAgent.onclick = (e) => {
	if(email.value.match(validEmail)) {
		e.preventDefault();
		let user = {
			id: Date.now(),
			name: name.value,
			email: email.value,
		};
		sendEmail(user.id);
		users.push(user);
		delTable.dispatchEvent(new CustomEvent('agentUpdated'));
		alert("Verification email sent");
		window.location.href = "admin.html";
		} else {
		email.setCustomValidity('Invalid email format');
	}
};

configure.onclick = (e) => {
	e.preventDefault();
	if(confirm("Do you want to save the changes")) {
		window.location.href = "admin.html";
		configureValue.bookingLimit = seatCount.value;
		configureValue.rowCount = compartment.value;
		localStorage.setItem('configureValue', JSON.stringify(configureValue));
		configModal.style.display = "none";
	}
};

openModals.forEach(modal => {
	modal[0].onclick = function() {
		modal[1].style.display = "block";
	}
});

closeModals.forEach(modal => {
	modal.onclick = function() {
		modal.closest(".modal").style.display = "none";
	}
});

window.onclick = function(event) {
	openModals.forEach(modal => {
		if (event.target == modal[1]) {
			modal[1].style.display = "none";
		}
	});
}

window.onkeydown = function(event) {
	if (event.key == "Escape") {
		openModals.forEach(modal => modal[1].style.display = "none");
	}
}

delTable.addEventListener("agentUpdated", displayAgent);
delTable.addEventListener("agentUpdated", saveToLocalStorage);
delTable.addEventListener("click", e => {
	if(e.target.matches(".delIcon")){
		deleteAgent(e.target.id);
	}
});

seatCount.value = configureValue.bookingLimit;
compartment.value = configureValue.rowCount;

// Generate Date
daylink.forEach((element) => {
	const index = daylink.indexOf(element);
	const span = element.querySelectorAll("span");
	const date = new Date();
	date.setDate(date.getDate() + index);
	element.id = date.toLocaleDateString();
	index === 0 ? span[0].innerText = "Today" : span[0].innerText = date.toString().substring(0,3).toUpperCase();
	span[1].innerText = date.getDate();
	element.addEventListener("click", e => displaySeats(e.currentTarget.id));
});

restoreFromLocalStorage();	
displaySeats(new Date().toLocaleDateString());