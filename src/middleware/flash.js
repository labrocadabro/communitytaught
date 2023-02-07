export default function sendFlash(req, res, next) {
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
}
