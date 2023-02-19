let users = [];
let bookings = [];
let configureValue = JSON.parse(localStorage.getItem("configureValue"));
const url = document.URL;
const agentId = url.substring(url.lastIndexOf('=') + 1);
const welcomeName = document.getElementById("welcome");
const container = document.querySelector(".container");
const bookNow = document.querySelector(".bookNow");
const bookingForm = document.querySelector(".bookingForm");
const formDate = document.getElementById("formDate");
const formTicketCount = document.getElementById("formTicketCount");
const formPassengersList = document.getElementById("passengersList");
const addPassenger = document.querySelector(".addPassenger");
const bookTickets = document.getElementById("bookTickets");
const myBookings = document.querySelector(".myBookings");
const bookNowModal = document.getElementById("bookNowModal");
const myBookingsModal = document.getElementById("myBookingsModal");

const test = document.getElementById("test");
const bookingModal = document.getElementById("bookingModal");

const closeModals = document.querySelectorAll(".close");
const openModals = [[bookNow,bookNowModal], [myBookings,myBookingsModal], [test,bookingModal]];
const daylink = Array.from(document.querySelectorAll(".daylink"));
const gridTable = document.querySelector("#gridTable");
const seats = document.querySelectorAll(".seatAvailable");

function saveToLocalStorage() {
	localStorage.setItem('users', JSON.stringify(users));
}

function restoreFromLocalStorage() {
	const user = JSON.parse(localStorage.getItem('users'));
	if(user) {
		users.push(...user);
	}
}

function restoreBookingsFromLocalStorage() {
	const booking = JSON.parse(localStorage.getItem('booking'));
	if(booking) {
		bookings.push(...booking);
	}
}

function addPassengers() {
	const passengerCount = formPassengersList.querySelectorAll(".overall");
	if(!formTicketCount.value) {
		alert(`Select Ticket Count`);
		} else {
		if(passengerCount.length < formTicketCount.value) {
			const code = `<div class="overall">
			<div class="mrow name">
			<label for="name" class="label">Name</label>
			<input type="text" name="name" id="name" class="input" pattern="[a-zA-Z ]{1,}" placeholder="alphabets only" autocomplete="off" required />
			</div>
			<div class="mrow age">
			<label for="age" class="label">Age</label>
			<input type="number" name="age" id="age" class="input" autocomplete="off" required />
			</div>
			<div class="mrow gender">
			<label for="gender" class="label">Gender</label>
			<select name="gender" id="gender" class="input" oninput="this.setCustomValidity('')" required />
			<option value="">Select</option>
			<option value="male">Male</option>
			<option value="female">Female</option>
			</select>
			</div>
			<div class="delIcon">&#10006</div>
			</div>`;
			formPassengersList.insertAdjacentHTML("beforeend", code);
			} else {
			alert(`Already added ${formTicketCount.value} Passengers`);
		}
	}
}

function displaySeats(a) {
	let count = 1;
	const bookedSeats = [];
	const selectedBookings = bookings.filter(booking => booking.date === a);
	const tBody = document.querySelector("#gridTable tbody");
	if(tBody) tBody.remove();
	document.querySelector(".active").classList.remove("active");
	document.getElementById(a).parentElement.classList.add("active");
	selectedBookings.forEach(booking => {
		booking.passengers.forEach(passenger => bookedSeats.push(Number(passenger.seat)));
	});
	for (var r = 0; r < configureValue.rowCount; r++) {
		var insertRowInTable = gridTable.insertRow(r);
		for (var c = 0; c < 7; c++) {
			insertRowInTable.insertCell(c);
			const currentCell = gridTable.rows[r].cells[c];
			if(c == 3) {
				currentCell.style.width = "15px";
				} else {
				currentCell.id = count;
				bookedSeats.includes(count) ? currentCell.classList.add("seat", "seatTaken") : currentCell.classList.add("seat", "seatAvailable");
				currentCell.innerText = count;
				count++;
			}
		}
	}
}

function checkWindowSeats(gender) {
	const seats = Array.from(document.querySelectorAll(".seatAvailable"));
	const windowSeats = seats.filter(element => element.cellIndex === 0 || element.cellIndex === 6);
	if(windowSeats) {
		const seat = checkNeighbourSeats(gender,windowSeats);
		if(seat !== "undefined") {
			windowSeats[seat].classList.replace("seatAvailable", "seatTaken");
			return windowSeats[seat].id;
		}
		} else {
		checkMiddleSeats(gender);
	}
}

function checkMiddleSeats(gender) {
	const seats = Array.from(document.querySelectorAll(".seatAvailable"));
	const middleSeats = seats.filter(element => element.cellIndex === 1 || element.cellIndex === 5);
	if(middleSeats) {
		const seat = checkNeighbourSeats(gender,middleSeats);
		if(seat !== "undefined") {
			middleSeats[seat].classList.replace("seatAvailable", "seatTaken");
			return middleSeats[seat].id;
		}
		} else {
		checkOverallSeats(gender);
	}
}

function checkOverallSeats(gender) {
	const seats = document.querySelectorAll(".seatAvailable");
	if(seats) {
		const seat = checkNeighbourSeats(gender,seats);
		if(seat !== "undefined") {
			seats[seat].classList.replace("seatAvailable", "seatTaken");
			return seats[seat].id;
		}
	}
}

function checkNeighbourSeats(gender,seats) {
	function checkGender(seat) {
		let check = true;
		const selectedBookings = bookings.filter(booking => booking.date === formDate.value);
		if(gender === "female") {
			selectedBookings.map(booking => booking.passengers.find(passenger => passenger.seat === seat ? passenger.gender === 'male' ? check = false : null : null));
			} else {
			selectedBookings.map(booking => booking.passengers.find(passenger => passenger.seat === seat ? passenger.gender === 'female' ? check = false : null : null));
		}
		return check;
	}
	
	for(var i=0; i < seats.length; i++) {
		const prevElement = seats[i].previousElementSibling ? seats[i].previousElementSibling.classList.contains("seatTaken") : null;
		const nextElement = seats[i].nextElementSibling ? seats[i].nextElementSibling.classList.contains("seatTaken") : null;
		if(prevElement && nextElement) {
			//checkGender(seats[i].previousElementSibling.id) && checkGender(seats[i].nextElementSibling.id) ? i : null;
			if(checkGender(seats[i].previousElementSibling.id) && checkGender(seats[i].nextElementSibling.id)) return i;
			} else if(prevElement && !nextElement) {
			//checkGender(seats[i].previousElementSibling.id) ? i : null;
			if(checkGender(seats[i].previousElementSibling.id)) return i;
			} else if(!prevElement && nextElement) {
			//checkGender(seats[i].nextElementSibling.id) ? i : null;
			if(checkGender(seats[i].nextElementSibling.id)) return i;
			} else {
			return i;
		}
	}
}

addPassenger.addEventListener("click", addPassengers);
formPassengersList.addEventListener("click", e => {
	if(e.target.matches(".delIcon")){
		e.target.parentElement.remove();
	}
});

bookingForm.onsubmit = (e) => {
	e.preventDefault();
	displaySeats(formDate.value);
	const passengers = [];
	const bookingId = Date.now();
	const name = formPassengersList.querySelectorAll("#name");
	const age = formPassengersList.querySelectorAll("#age");
	const gender = formPassengersList.querySelectorAll("#gender");
	if(name.length != formTicketCount.value) {
		alert("Passengers count doesn't match with ticket count");
		} else {
		for(var i=0; i < name.length; i++) {
			const passenger = {
				name: name[i].value,
				age: age[i].value,
				gender: gender[i].value,
			};
			passengers.push(passenger);
		}
		const priorityFemales = passengers.filter(passenger => passenger.gender === "female" && passenger.age >= "60");
		const priorityMales = passengers.filter(passenger => passenger.gender === "male" && passenger.age >= "60");
		const otherPassengers = passengers.filter(passenger => passenger.age < "60");
		if(priorityFemales) {
			priorityFemales.map(person => {
				const seatNumber = checkWindowSeats(person.gender);
				if(seatNumber) {
					person.seat = seatNumber;
					} else {
					if(person.gender === "female") {
						return alert("Only male can book this seat");
						} else {
						return alert("Only female can book this seat");
					}
				}
			});
		}
		if(priorityMales) {
			priorityMales.map(person => {
				const seatNumber = checkWindowSeats(person.gender);
				if(seatNumber) {
					person.seat = seatNumber;
					} else {
					if(person.gender === "female") {
						return alert("Only male can book this seat");
						} else {
						return alert("Only female can book this seat");
					}
				}
			});
		}
		if(otherPassengers) {
			otherPassengers.map(person => {
				const seatNumber = checkOverallSeats(person.gender);
				if(seatNumber) {
					person.seat = seatNumber;
					} else {
					if(person.gender === "female") {
						return alert("Only male can book this seat");
						} else {
						return alert("Only female can book this seat");
					}
				}
			});
		}
		const booking = {
			bookingId,
			agentId,
			date: formDate.value,
			time: new Date().toLocaleTimeString(),
			ticketCount: formTicketCount.value,
			passengers,
		};
		bookings.push(booking);
		localStorage.setItem('booking', JSON.stringify(bookings));
		alert("Booking successful");
		location.reload();
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

restoreFromLocalStorage();
restoreBookingsFromLocalStorage();

const user = users.find(user => user.id == agentId);
if(user) {
	welcomeName.innerText = user.name;
	} else {
	container.innerHTML = `<h2>You are not authorized to view this page</h2>`;
}

// Booking form ticket count options
formDate.addEventListener("change", e => {
	if(e.target.value) {
		displaySeats(e.target.value);
		const seats = document.querySelectorAll(".seatAvailable");
		formTicketCount.innerHTML = `<option value="">Select</option>`;
		if(seats.length < configureValue.bookingLimit) {
			for(var i = 1; i <= seats.length; i++) { 
				formTicketCount.innerHTML += `<option value="${i}">${i}</option>`;
			}
			} else {
			for(var i = 1; i <= configureValue.bookingLimit; i++) {
				formTicketCount.innerHTML += `<option value="${i}">${i}</option>`;
			}
		}
	}
});

// Generate Date
daylink.forEach((element) => {
	const index = daylink.indexOf(element);
	const span = element.querySelectorAll("span");
	const date = new Date();
	date.setDate(date.getDate() + index);
	const dateString = date.toLocaleDateString();
	element.id = dateString;
	formDate.innerHTML += `<option value="${dateString}">${dateString}</option>`;
	index === 0 ? span[0].innerText = "Today" : span[0].innerText = date.toString().substring(0,3).toUpperCase();
	span[1].innerText = date.getDate();
	element.addEventListener("click", e => displaySeats(e.currentTarget.id));
});

displaySeats(new Date().toLocaleDateString());																				