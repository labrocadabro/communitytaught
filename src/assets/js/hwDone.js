const cbs = document.querySelectorAll('input[type="checkbox"]');
cbs.forEach(cb => cb.addEventListener('change', checkDone));


function checkDone() {
	const homework = this.dataset.hw;
	const hwCBs = Array.from(document.querySelectorAll(`[data-hw="${homework}"]`));
	if (hwCBs.every(cb => cb.checked)) {
		document.getElementById(`${homework}`).classList.add('done');
	} else {
		document.getElementById(`${homework}`).classList.remove('done');
	}
}