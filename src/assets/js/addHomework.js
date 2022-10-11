const requiredCheck = document.querySelectorAll('.required-check');
const extradCheck = document.querySelectorAll('.extra-check');
const addItemButton = document.getElementById('add-item');
let itemIndex = document.querySelectorAll('.hw-item').length + 1;

addItemButton.addEventListener('click', addItem);
requiredCheck.forEach(check => {
	check.addEventListener('change', updateRequired);
});
extradCheck.forEach(check => {
	check.addEventListener('change', updateExtra);
});

function addItem(e) {
	e.preventDefault();
	const newItem = document.createElement('div');
	newItem.classList.add('hw-item');
	newItem.innerHTML = `
		<label for="item-class-${itemIndex}">Class Assigned</label>
		<input id="item-class-${itemIndex}" type="text" name="itemClass" autocomplete="off">
		<label for="item-due-${itemIndex}">Class Due</label>
		<input id="item-due-${itemIndex}" type="text" name="itemDue" autocomplete="off">
		<label for="desc-${itemIndex}">Description</label>
		<textarea class="col-span-2" id="desc-${itemIndex}" name="desc" autocomplete="off"></textarea>
		<div>
			<input id="required-${itemIndex}" class="required" type="hidden" name="required" value="false">
			<input id="required-check-${itemIndex}" type="checkbox" autocomplete="off">
			<label class="ml-2" for="required-check-${itemIndex}">Required</label>
			<br>
			<input id="extra-${itemIndex}" class="required" type="hidden" name="extra" value="false">
			<input id="extra-check-${itemIndex}" type="checkbox" autocomplete="off">
			<label class="ml-2" for="extra-check-${itemIndex}">Extra/Push Work</label>
		</div>
	`;
	document.getElementById('hw-items').append(newItem);
	document.getElementById(`required-check-${itemIndex}`).addEventListener('change', updateRequired);
	document.getElementById(`extra-check-${itemIndex}`).addEventListener('change', updateExtra);
	itemIndex += 1;
}

function updateRequired(e) {
	const required = e.target.parentNode.querySelector('.required');
	required.value = required.value === "false" ? "true" : "false";
}

function updateExtra(e) {
	const extra = e.target.parentNode.querySelector('.extra')
	extra.value = extra.value === "false" ? "true" : "false";
}
