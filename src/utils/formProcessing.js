export function ensureArray(data) {
	return data ? [].concat(data) : [];
}

export function createDocument(formData) {
	const document = {};
	for (let key in formData) {
		if (formData[key]) document[key] = formData[key];
	}
	return document;
}

// TODO: make sure objects have both entries (eg if classes_number and classes_date are different lengths it should cause a problem)
// I think this can be handled by a custom setter
