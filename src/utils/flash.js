export default function setFlash(type, message, redirect) {
	req.session.flash = { type, message };
	return res.redirect(redirect);
}
