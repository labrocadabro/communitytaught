const requiredCheck = document.querySelectorAll('.required-check');
const hwButton = document.getElementById('add-hw');
const pwButton = document.getElementById('add-pw');
let hwIndex = document.querySelectorAll('.hw-item').length + 1;
let pwIndex = document.querySelectorAll('.pw-item').length + 1;

hwButton.addEventListener('click', addHW);
pwButton.addEventListener('click', addPW);
requiredCheck.forEach(check => {
	check.addEventListener('change', updateRequired);
});

function addHW(e) {
	e.preventDefault();
	const newItem = document.createElement('div');
	newItem.classList.add('hw-item');
	newItem.innerHTML = `
		<div></div>
		<div class="col-span-3">
			<input class="required" id="required-${hwIndex}" type="hidden" name="required" value="false">
			<input class="required-check" id="required-check-${hwIndex}" type="checkbox" autocomplete="off">
			<label class="ml-2" for="required-check-${hwIndex}">Required</label>
		</div>
		<label for="hw-class-${hwIndex}">Class Assigned</label>
		<input id="hw-class-${hwIndex}" type="text" name="hwClass" autocomplete="off">
		<label for="hw-due-${hwIndex}">Class Due</label>
		<input id="hw-due-${hwIndex}" type="text" name="hwDue" autocomplete="off">
		<label for="hw-desc-${hwIndex}">Description</label>
		<textarea class="col-span-2" id="hw-desc-${hwIndex}" name="hwDesc" autocomplete="off"></textarea>
	`;
	document.getElementById('hw-items').append(newItem);
	document.getElementById(`required-check-${hwIndex}`).addEventListener('change', updateRequired);
	hwIndex += 1;
}

function addPW(e) {
	e.preventDefault();
	const newItem = document.createElement('div');
	newItem.classList.add('pw-item');
	newItem.innerHTML = `
		<label for="pw-class-${pwIndex}">Class Assigned</label>
		<input id="pw-class-${pwIndex}" type="text" name="pwClass" autocomplete="off">
		<label for="pw-due-${pwIndex}">Class Due</label>
		<input id="pw-due-${pwIndex}" type="text" name="pwDue" autocomplete="off">
		<label for="pw-desc-${pwIndex}">Description</label>
		<textarea class="col-span-2" id="pw-desc-${pwIndex}" name="pwDesc" autocomplete="off"></textarea>
	`;
	document.getElementById('pw-items').append(newItem);
	pwIndex += 1;
}

function updateRequired(e) {
	const required = e.target.parentNode.querySelector('.required');
	required.value = required.value === "false" ? "true" : "false";
}
