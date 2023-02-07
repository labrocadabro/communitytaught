import Token from "../auth/models/Token.js";

export const index = (req, res) => {
	res.render("index");
};

export const about = (req, res) => {
	res.render("about");
};

export const reset = async (req, res) => {
	try {
		if (!req.query.token) return res.redirect("/login");
		const token = await Token.findOne({ token: req.query.token });
		if (!token) {
			req.session.flash = {
				type: "error",
				message: ["Invalid or expired link."],
			};
			return res.redirect("/forgot");
		}
		res.render("reset", { email: token.email, token: token.token });
	} catch (err) {
		console.log(err);
		req.session.flash = { type: "error", message: ["Verification error."] };
		res.redirect("/forgot");
	}
};

export const resources = (req, res) => {
	res.render("resource/index");
};

export const resourcePage = (req, res) => {
	res.render(`resource/${req.params.page}`);
};
