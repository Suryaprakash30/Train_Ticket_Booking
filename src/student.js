const calculations = [];
let count = 1;
const showResult = document.querySelector("p");

function restoreFromLocalStorage() {
	const calculation = JSON.parse(localStorage.getItem('calc'));
	if(calculation) {
		calculations.push(...calculation);
	}
}

restoreFromLocalStorage();

calculations.forEach((calculation) => {
	showResult.innerHTML += `${count}) <b>Question:</b> ${calculation.question}<br>
	<b>Answer:</b> ${calculation.result}<br><br>`;
	count++;
});