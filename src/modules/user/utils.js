import redirects from "../../data/redirects.js";

export function redirectNotAdmin(req, res) {
	if (!req.isAuthenticated() || !req.user.admin)
		return res.redirect(redirects.home);
}
