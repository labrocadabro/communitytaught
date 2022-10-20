const titles = document.querySelectorAll('dt');
const panels = document.querySelectorAll('dd');

titles.forEach(title => title.addEventListener('click', expandPanel));

function expandPanel() {
	const title = this;
	const panel = this.nextSibling;
	if (title.classList.contains('opened')) title.classList.remove('opened')
	else title.classList.add('opened');
	if (panel.classList.contains('opened')) panel.classList.remove('opened')
	else panel.classList.add('opened');
}
