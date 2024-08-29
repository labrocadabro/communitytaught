const innerMeter = document.querySelector('.meter-inner');
const checkboxes = document.querySelectorAll('.watched');
let completed = Number(innerMeter.innerText);

if (checkboxes) {
    for (const checkbox of checkboxes) {
        checkbox.addEventListener('change', updateProgress);
    }
}

function updateWidth() {
    innerMeter.style.width = `${completed / checkboxes.length * 100}%`;
    innerMeter.innerText = `${completed} / ${checkboxes.length}  `;
    if (completed === checkboxes.length) {
        innerMeter.innerText = "You are a software engineer.";
    }
}

function updateProgress(e) {
    if (e.target.checked) {
        completed += 1;
    } else {
        completed -= 1;
    }
    updateWidth();
}

// Set the progress bar width on page load
updateWidth();
