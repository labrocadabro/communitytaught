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
