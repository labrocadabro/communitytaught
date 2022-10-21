closeFlash = document.querySelectorAll('.flash-close');

closeFlash && closeFlash.forEach(flash => flash.addEventListener('click', () => flash.parentNode.style.display = "none"));

mobileMenu = document.getElementById('mobile-menu');

mobileMenu.addEventListener('click', openMenu);

function openMenu() {
	const desktopMenu = document.getElementById('desktop-menu');
	console.log(desktopMenu.classList)
	const closed = desktopMenu.classList.contains('hidden');
	console.log(closed)
	if (closed) {
		desktopMenu.classList.add('menu-opened');
		desktopMenu.classList.remove('hidden');
		document.querySelector('main').style.display = "none";
	} else {
		desktopMenu.classList.remove('menu-opened');
		desktopMenu.classList.add('hidden');
		document.querySelector('main').style.display = "block";
	}
}