const emailLink = document.querySelector('#change-email a');
const passwordLink = document.querySelector('#change-password a');
const deleteButton = document.querySelector('#delete-account button#first');
const deleteForm = document.querySelector('#delete-form');

passwordLink.addEventListener('click', changePassword);
emailLink.addEventListener('click', changeEmail);
deleteButton.addEventListener('click', confirmDeleteAccount);
deleteForm.addEventListener('submit', deleteAccount);

function changePassword(e) {
	e.preventDefault();
	const form = (this.id === 'change') ? 
		document.getElementById('change-form') :
		document.getElementById('set-form');
		form.style.display = 'block';
		this.style.display = "none";
}


function changeEmail(e) {
	e.preventDefault();
	const form = document.getElementById('email-form');
	form.style.display = 'block';
	this.style.display = "none";
}

function confirmDeleteAccount() {
	const form = document.getElementById('delete-form');
	form.style.display = 'block';
	this.style.display = "none";
}

async function deleteAccount(e) {
	e.preventDefault();
	const username = document.getElementById('delete_username').value;
	const confirm = document.getElementById('delete_confirm').value;
	if (username !== confirm) {
		document.getElementById('wrong').innerText = "Your entry did not match the email on the account";
		return;
	}
	const res = await fetch('/delete-account', {
		method: 'delete'
	})
	const data = await res.json();
	console.log(data);
	location.href = "/";
}
