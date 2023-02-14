export function setString(str) {
	return str.length ? str : undefined;
}
export function setArray(arr) {
	return arr.length && arr[0].length ? arr : undefined;
}
export function setObject(obj) {
	return Object.values(obj).every((v) => v !== "") ? obj : undefined;
}
export function setObjectArray(arr) {
	const output = arr.filter((obj) => Object.values(obj).every((v) => v !== ""));
	return output.length ? output : undefined;
}
