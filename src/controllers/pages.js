import { notLoggedIn } from "./auth.js";

import Token from "../models/Token.js";
import User from "../models/User.js";

export const index = (req, res) => {
	res.render("index");
};

export const dashboard = (req, res) => {
	if (!req.isAuthenticated()) notLoggedIn(req, res);
	else res.render("dashboard");
};

export const account = (req, res) => {
	if (!req.isAuthenticated()) return notLoggedIn(req, res);
	res.render("account");
};

export const login = (req, res) => {
	if (req.isAuthenticated()) res.redirect('/dashboard');
	else res.render('login');	
};

export const register = (req, res) => {
	if (req.isAuthenticated()) res.redirect('/dashboard');
	else res.render('register');
};

export const forgot = (req, res) => {
	if (req.isAuthenticated()) res.redirect('/dashboard');
	else res.render('forgot');	
};

export const reset = async (req, res) => {
	try {
		if (!req.query.token) return res.redirect('/login');
		const token = await Token.findOne({ token: req.query.token });
		if (!token) {
			req.session.flash = { type: "error", message: ["Invalid or expired link."]}
			return res.redirect('/forgot');
		}
		res.render('reset', { email: token.email, token: token.token });
	} catch (err) {
		console.log(err);
		req.session.flash = { type: "error", message: ["Verification error."]}
		res.redirect('/forgot');
	}
}
