const title = document.getElementById('video-title');
const videoId = document.getElementById('video-id');
const classNo = document.getElementById('number');
const addTsButton = document.getElementById('add-timestamp');
let tsIndex = document.querySelectorAll('.timestamp').length;

title.addEventListener("change", addPermalink);
videoId.addEventListener("change", addThumbnail);
classNo.addEventListener("change", updateSlidesClass);
addTsButton.addEventListener('click', addTimestamp);

function addPermalink() {
	const permalink = title.value
		
		.split('')
		.map(c => c.toLowerCase())
		.filter(c => {
			return (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122) || c.charCodeAt(0) === 32;
		})
		.join('')
		.replace(/\s/g, "-");
		document.getElementById("permalink").value = permalink;
		document.getElementById("permalink").disabled = false;
}

function addThumbnail() {
	const thumbnail = `https://i3.ytimg.com/vi/${videoId.value}/maxresdefault.jpg`;
	document.getElementById("thumbnail").value = thumbnail;
	document.getElementById("thumbnail").disabled = false;
}

function updateSlidesClass() {
	document.getElementById("slides-classNo").value = classNo.value;
}

function addTimestamp(e) {
	e.preventDefault();
	const newTs = document.createElement('div');
	newTs.classList.add('timestamp');
	newTs.innerHTML = `
		<label for="ts-time-${tsIndex}">Time</label>
		<input id="ts-time-${tsIndex}" type="number" name="tsTime">
		<label for="ts-title-${tsIndex}">Title</label>
		<input id="ts-title-${tsIndex}" type="text" name="tsTitle">
	`;
	tsIndex += 1;
	document.getElementById('timestamps').append(newTs);
}