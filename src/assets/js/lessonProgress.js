const watched = document.querySelectorAll('.watched');
const checkedin = document.querySelectorAll('.checkedin');

watched.forEach(el => el.addEventListener('change', toggleWatched));
checkedin.forEach(el => el.addEventListener('change', toggleCheckedIn));

async function toggleWatched() {
	try {
		const id = this.id.split("-")[1];
		const res = await fetch(`/class/watched/${id}`, {
			method: "put",
		}); 
	} catch (err) {
		console.log(err)
	}
}

async function toggleCheckedIn() {
		try {
			const id = this.id.split("-")[1];
			const res = await fetch(`/class/checkedin/${id}`, {
				method: "put",
			}); 
		} catch (err) {
			console.log(err)
		}
}
