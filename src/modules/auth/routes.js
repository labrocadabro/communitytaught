import express from "express";
import passport from "passport";
import { Octokit } from "@octokit/core";
import { createOAuthUserAuth } from "@octokit/auth-oauth-user";

import dotenv from "dotenv";
dotenv.config();

import * as auth from "./controllers.js";

import User from "../user/models/User.js";

import redirects from "../../data/redirects.js";

const router = express.Router();

router.get("/register", auth.showRegister);
router.get("/login", auth.showLogin);
router.get("/forgot", auth.showForgot);
router.get("/reset", auth.showReset);

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/logout", auth.logout);
router.get("/verify", auth.verify);
router.post("/reset", auth.reset);

router.post("/change-password", auth.changePassword);
router.post("/set-password", auth.setPassword);
router.post("/change-email", auth.changeEmail);
router.delete("/delete-account", auth.deleteAccount);

// GOOGLE
router.get(
	"/oauth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
	"/oauth/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	function (req, res) {
		res.redirect(redirects.dashboard);
	}
);

router.get("/oauth/google/revoke", async (req, res) => {
	if (unlinkGoogle(req)) {
		req.session.flash = {
			type: "success",
			message: ["Google acocunt unlinked successfully"],
		};
		res.redirect(redirects.account);
	} else {
		req.session.flash = {
			type: "error",
			message: ["Could not unlink account"],
		};
		res.redirect(redirects.account);
	}
});

export const unlinkGoogle = async (req) => {
	try {
		const token = req.user.googleToken;
		const res = await fetch(
			`https://user/accounts.google.com/o/oauth2/revoke?token=${token}`,
			{
				method: "post",
				headers: { "content-type": "application/x-www-form-urlencoded" },
			}
		);
		const data = await res.json();
		if (data.error) throw new Error();
		const user = await User.findById(req.user._id);
		user.googleId = null;
		user.googleToken = null;
		await user.save();
		return true;
	} catch (err) {
		return false;
	}
};

// GITHUB

router.get(
	"/oauth/github",
	passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
	"/oauth/github/callback",
	passport.authenticate("github", { failureRedirect: "/login" }),
	function (req, res) {
		res.redirect(redirects.dashboard);
	}
);

router.get("/oauth/github/revoke", async (req, res) => {
	if (unlinkGithub(req)) {
		req.session.flash = {
			type: "success",
			message: ["Github account unlinked successfully"],
		};
		res.redirect(redirects.account);
	} else {
		req.session.flash = {
			type: "error",
			message: ["Could not unlink account."],
		};
		res.redirect(redirects.account);
	}
});

export const unlinkGithub = async (req) => {
	try {
		const octokit = new Octokit({
			authStrategy: createOAuthUserAuth,
			auth: {
				clientId: process.env.GITHUB_ID,
				clientSecret: process.env.GITHUB_SECRET,
			},
		});
		await octokit.request(
			`DELETE /applications/${process.env.GITHUB_ID}/grant`,
			{ access_token: req.user.githubToken }
		);
		const user = await User.findById(req.user._id);
		user.githubId = null;
		user.githubToken = null;
		await user.save();
		return true;
	} catch (err) {
		return false;
	}
};

export default router;
