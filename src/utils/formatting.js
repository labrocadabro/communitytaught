export function ensureArray(data) {
	return data ? [].concat(data) : [];
}

export function mapData(formData) {
	const data = {};
	for (let key in formData) {
		if (key.endsWith("[]")) {
			const newKey = key.slice(0, -2);
			data[newKey] = ensureArray(formData[key]);
		} else {
			data[key] = formData[key];
		}
	}
	return data;
}

// TODO: make sure empty fields are not recorded to db
// TODO: make sure objects have both entries (eg if classes_number and classes_date are different lengths it should cause a problem... except that happens with super reviews... hmmm)

// const classesData = [];
// const numberData = ensureArray(req.body["classes_number[]"]);
// const dateData = ensureArray(req.body["classes_date[]"]);
// for (let i = 0; i < numberData.length; i++) {
// 	classesData.push({
// 		number: numberData[i],
// 		date: dateData[i],
// 	});
// }
// const timestampsData = [];
// const tstitleData = ensureArray(req.body["timestamps_title[]"]);
// const tstimeData = ensureArray(req.body["timestamps_time[]"]);
// for (let i = 0; i < tstitleData.length; i++) {
// 	timestampsData.push({
// 		title: tstitleData[i],
// 		time: tstimeData[i],
// 	});
// }
// const lessonData = {
// 	classes: classesData,
// 	videoId: req.body.videoId,
// 	thumbnail: req.body.thumbnail,
// 	title: req.body.title,
// 	permalink: req.body.permalink,
// 	slides: ensureArray(req.body["slides[]"]),
// 	materials: ensureArray(req.body["materials[]"]),
// 	checkins: ensureArray(req.body["checkins[]"]),
// 	motivation: {
// 		title: req.body.motivation_title,
// 		link: req.body.motivation_link,
// 	},
// 	note: req.body.note,
// 	timestamps: timestampsData,
// };
