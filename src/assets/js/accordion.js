const titles = document.querySelectorAll('dt');
const panels = document.querySelectorAll('dd');

titles.forEach(title => title.addEventListener('click', expandPanel));

function expandPanel() {
	const title = this;
	const panel = this.nextSibling;
	if (title.classList.contains('acc-opened')) title.classList.remove('acc-opened')
	else title.classList.add('acc-opened');
	if (panel.classList.contains('acc-opened')) panel.classList.remove('acc-opened')
	else panel.classList.add('acc-opened');
}
