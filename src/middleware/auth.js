import dotenv from "dotenv";

import Token from "../models/Token.js";

dotenv.config();

export default async function auth(req, res, next) {
	res.locals.loggedIn = req.isAuthenticated();

	if (res.locals.loggedIn) {
		const { username, verified, hasPassword, googleId, githubId, admin } =
			req.user;
		res.locals.user = {
			username,
			verified,
			hasPassword,
			googleId,
			githubId,
			admin,
		};

		if (!req.user.verified) {
			const token = await Token.findOne({ email: req.user.username });
			res.locals.token = token;
		} else {
			res.locals.token = null;
		}
	}
	next();
}
