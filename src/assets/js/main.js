const closeFlash = document.querySelectorAll(".flash-close");

closeFlash &&
	closeFlash.forEach((flash) =>
		flash.addEventListener(
			"click",
			() => (flash.parentNode.style.display = "none")
		)
	);

const mobileMenu = document.getElementById("mobile-menu");
const desktopMenu = document.getElementById("desktop-menu");
const accountMenu = document.getElementById("account-menu");
const accountDropdown = document.getElementById("account-dropdown");
const hideOnMobile = document.querySelectorAll(".no-mobile");

mobileMenu.addEventListener("click", openMobileMenu);
accountMenu && accountMenu.addEventListener("click", openDropdown);
accountDropdown &&
	accountDropdown.addEventListener("click", (e) => e.stopPropagation());

function openMobileMenu() {
	const closed = desktopMenu.classList.contains("hidden");
	if (closed) {
		desktopMenu.classList.add("mobile-menu");
		desktopMenu.classList.remove("hidden");
		if (accountDropdown) {
			accountDropdown.classList.remove("hidden", "absolute", "border");
			document.getElementById("account-first").classList.remove("pt-2");
			document.getElementById("account-last").classList.remove("pb-4");
		}
		hideOnMobile.forEach((el) => el.classList.add("hidden"));
		document.querySelector("main").style.display = "none";
		document.body.classList.add("fixed");
	} else {
		desktopMenu.classList.remove("mobile-menu");
		desktopMenu.classList.add("hidden");
		if (accountDropdown) {
			accountDropdown.classList.add("hidden", "absolute", "border");
			document.getElementById("account-first").classList.add("pt-2");
			document.getElementById("account-last").classList.add("pb-4");
		}

		hideOnMobile.forEach((el) => el.classList.remove("hidden"));
		document.querySelector("main").style.display = "block";
		document.body.classList.remove("fixed");
	}
}

function openDropdown(e) {
	e.stopPropagation();
	accountDropdown.classList.toggle("hidden");
	if (!accountDropdown.classList.contains("hidden")) {
		document.addEventListener("click", closeDropdown);
	}
}

function closeDropdown(e) {
	accountDropdown.classList.add("hidden");
	document.removeEventListener("click", closeDropdown);
}
