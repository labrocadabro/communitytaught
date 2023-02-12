export function mapData(formData) {
	const data = {};
	for (let key in formData) {
		if (key.endsWith("_arr")) {
			const newKey = key.slice(0, -4);
			console.log(newKey);
			data[newKey] = formData[key] ? formData[key].split(",") : [];
		} else data[key] = formData[key];
	}
	return data;
}
