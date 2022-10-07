closeFlash = document.querySelectorAll('.flash-close');

closeFlash && closeFlash.forEach(flash => flash.addEventListener('click', () => flash.parentNode.style.display = "none"));