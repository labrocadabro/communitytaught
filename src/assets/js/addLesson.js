const title = document.getElementById("video-title");
const videoId = document.getElementById("video-id");
// const addTsButton = document.getElementById("add-timestamp");
// let tsIndex = document.querySelectorAll(".timestamp").length;

title.addEventListener("blur", addPermalink);
videoId.addEventListener("change", addThumbnail);
// addTsButton.addEventListener("click", addTimestamp);

function addPermalink() {
	// don't generate permalink if one already exists
	if (document.getElementById("permalink").value.trim().length) return;
	const permalink = title.value
		.trim()
		.split("")
		.map((c) => c.toLowerCase())
		.filter((c) => {
			return (
				(c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122) ||
				(c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57) ||
				c.charCodeAt(0) === 32
			);
		})
		.join("")
		.replace(/\s/g, "-")
		.replace(/--/g, "-");
	document.getElementById("permalink").value = permalink;
	document.getElementById("permalink").disabled = false;
}

function addThumbnail() {
	const thumbnail = `https://i3.ytimg.com/vi/${videoId.value}/maxresdefault.jpg`;
	document.getElementById("thumbnail").value = thumbnail;
	document.getElementById("thumbnail").disabled = false;
}

function addTimestamp(e) {
	e.preventDefault();
	const newTs = document.createElement("div");
	newTs.classList.add("timestamp");
	newTs.innerHTML = `
		<label for="ts-time-${tsIndex}">Time</label>
		<input id="ts-time-${tsIndex}" type="number" name="tsTime">
		<label for="ts-title-${tsIndex}">Title</label>
		<input id="ts-title-${tsIndex}" type="text" name="tsTitle">
	`;
	tsIndex += 1;
	document.getElementById("timestamps").append(newTs);
}

function addEntry(container, ...fields) {
	for (let field of fields) {
		let clone = field.cloneNode(true);
		clone.value = "";
		container.append(clone);
	}
}

document
	.getElementById("add-slides")
	.addEventListener("click", () =>
		addEntry(
			document.getElementById("slidesData"),
			document.getElementById("slides")
		)
	);

document
	.getElementById("add-materials")
	.addEventListener("click", () =>
		addEntry(
			document.getElementById("materialsData"),
			document.getElementById("materials")
		)
	);

document
	.getElementById("add-checkin")
	.addEventListener("click", () =>
		addEntry(
			document.getElementById("checkinData"),
			document.getElementById("checkin")
		)
	);
document
	.getElementById("add-class")
	.addEventListener("click", () =>
		addEntry(
			document.getElementById("classData"),
			document.getElementById("classNo"),
			document.getElementById("dates")
		)
	);
