const hwItems = document.querySelectorAll('.item');
const hwExtras = document.querySelectorAll('.extra');
const hwSubmits = document.querySelectorAll('.submitted');

hwItems.forEach(el => el.addEventListener('change', toggleItem));
hwExtras.forEach(el => el.addEventListener('change', toggleExtra));
hwSubmits.forEach(el => el.addEventListener('change', toggleSubmitted));

async function toggleItem() {
	try {
		const itemId = this.id.split("-")[1];
		const res = await fetch(`/hw/item/${itemId}`, {
			method: "put",
		}); 
	} catch (err) {
		console.log(err)
	}
}

async function toggleExtra() {
	try {
		const itemId = this.id.split("-")[1];
		const res = await fetch(`/hw/extra/${itemId}`, {
			method: "put",
		}); 
	} catch (err) {
		console.log(err)
	}
}

async function toggleSubmitted() {
	try {
		const itemId = this.id.split("-")[1];
		const res = await fetch(`/hw/submit/${itemId}`, {
			method: "put",
		}); 
	} catch (err) {
		console.log(err)
	}
}