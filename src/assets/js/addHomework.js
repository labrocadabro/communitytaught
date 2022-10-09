const requiredCheck = document.getElementById('required-check');
const extradCheck = document.getElementById('extra-check');
const addItemButton = document.getElementById('add-item');
const hwItem = document.querySelector('.hw-item');

addItemButton.addEventListener('click', addItem);
requiredCheck.addEventListener('change', updateRequired);
extradCheck.addEventListener('change', updateExtra);

function addItem(e) {
	e.preventDefault();
	const newItem = hwItem.cloneNode(true);
	newItem.querySelector('#desc').value = "";
	newItem.querySelector('#required').value = "false";
	newItem.querySelector('#required-check').checked = false;
	newItem.querySelector('#extra').value = "false";
	newItem.querySelector('#extra-check').checked = false;

	document.getElementById('hw-items').append(newItem);
}

function updateRequired() {
	const required = document.getElementById('required');
	required.value = required.value === "false" ? "true" : "false";
}

function updateExtra() {
	const extra = document.getElementById('extra');
	extra.value = extra.value === "false" ? "true" : "false";
}
