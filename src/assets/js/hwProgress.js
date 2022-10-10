const hwItems = document.querySelectorAll('.item');
const hwExtras = document.querySelectorAll('.extra');

hwItems.forEach(el => el.addEventListener('change', toggleItem));
hwExtras.forEach(el => el.addEventListener('change', toggleExtra));


async function toggleItem() {
	try {
		const itemId = this.id.split("-")[1];
		const hwId = this.id.split("-")[2];
		const res = await fetch(`/hw/item/${itemId}/${hwId}`, {
			method: "put",
		}); 
	} catch (err) {
		console.log(err)
	}
}

async function toggleExtra() {
	try {
		const itemId = this.id.split("-")[1];
		const hwId = this.id.split("-")[2];
		const res = await fetch(`/hw/extra/${itemId}/${hwId}`, {
			method: "put",
		}); 
	} catch (err) {
		console.log(err)
	}
}