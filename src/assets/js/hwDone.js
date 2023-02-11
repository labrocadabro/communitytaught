const cbs = document.querySelectorAll('input[type="checkbox"]');
cbs.forEach((cb) => cb.addEventListener("change", checkDone));

function checkDone() {
	if (this.classList.contains("extra")) return;
	if (this.classList.contains("watched")) return;
	if (this.classList.contains("checkedin")) return;
	const homework = this.dataset.hw;
	const hwCBs = Array.from(
		document.querySelectorAll(`[data-hw="${homework}"]`)
	);
	if (hwCBs.every((cb) => cb.checked)) {
		document.getElementById(`${homework}`).classList.add("done");
	} else {
		document.getElementById(`${homework}`).classList.remove("done");
	}
}
