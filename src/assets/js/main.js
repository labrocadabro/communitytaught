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
accountMenu.addEventListener("click", openDropdown);
accountDropdown.addEventListener("click", (e) => e.stopPropagation());

function openMobileMenu() {
  const closed = desktopMenu.classList.contains("hidden");
  if (closed) {
    desktopMenu.classList.add("menu-opened");
    desktopMenu.classList.remove("hidden");
    accountDropdown.classList.remove("hidden", "absolute", "border");
    hideOnMobile.forEach((el) => el.classList.add("hidden"));
    document.querySelector("main").style.display = "none";
  } else {
    desktopMenu.classList.remove("menu-opened");
    desktopMenu.classList.add("hidden");
    accountDropdown.classList.add("hidden", "absolute", "border");
    hideOnMobile.forEach((el) => el.classList.remove("hidden"));
    document.querySelector("main").style.display = "block";
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
