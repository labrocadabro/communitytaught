const cbs = document.querySelectorAll('input[type="checkbox"]');
cbs.forEach(cb => cb.addEventListener('change', checkDone));

function checkDone() {
	const lesson = this.dataset.lesson;
	const lessonCBs = Array.from(document.querySelectorAll(`[data-lesson="${lesson}"]`));
	if (lessonCBs.every(cb => cb.checked)) {
		document.getElementById(`${lesson}`).classList.add('done');
	} else {
		document.getElementById(`${lesson}`).classList.remove('done');
	}
}