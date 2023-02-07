import nodemailer from "nodemailer";
import validator from "validator";

import dotenv from "dotenv";
dotenv.config();

import User from "../user/models/User.js";
import Token from "../auth/models/Token.js";

import redirects from "../../data/redirects.js";

const from = `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`;

let transport;
if (process.env.NODE_ENV === "production") {
	transport = nodemailer.createTransport({
		// production server using smtp
		host: process.env.SMTP_SERVER,
		port: process.env.SMTP_PORT,
		secure: false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});
} else {
	transport = nodemailer.createTransport({
		// test server using Mailhog
		host: "0.0.0.0",
		port: 1025,
	});
}

export const verify = async (req, res) => {
	try {
		const email = req.user?.username;
		if (!email) return res.redirect(redirects.dashboard);
		if (!req.user.verified) {
			const token = Token.generate();
			await Token.saveNew(token, email);
			const url = `${process.env.DOMAIN}/verify?token=${token}`;
			await transport.sendMail({
				from: from,
				to: email,
				subject: "Please verify your CommunityTaught.org account",
				text: `To verify your account, please copy and paste this link into your browser: ${url}`,
				html: `<h3>Verify your account</h3><p>Please click <a href="${url}">this link</a> to verify your account</p>`,
			});
		}
	} catch (err) {
		console.log(err);
	} finally {
		res.redirect(req.session.returnTo || redirects.dashboard);
	}
};

export const forgot = async (req, res) => {
	if (!validator.isEmail(req.body.username)) {
		req.session.flash = {
			type: "error",
			message: "Please enter a valid email address.",
		};
		return res.redirect(redirects.forgot);
	}
	const email = req.body.username;
	const user = await User.findOne({ username: email });
	// will need some logic here to handle 3rd party logins that don't have passwords
	let token = null;
	if (user) {
		token = Token.generate();
		await Token.saveNew(token, email);
	}
	if (token) {
		const url = `${process.env.DOMAIN}/reset?token=${token}`;
		await transport.sendMail({
			from: from,
			to: email,
			subject: "Reset CommunityTaught.org Password",
			text: `To reset your password, please copy and paste this link into your browser: ${url}`,
			html: `<h3>Reset Password</h3><p>Please click <a href="${url}">this link</a> to reset your password</p>`,
		});
	} else {
		await transport.sendMail({
			from: from,
			to: email,
			subject: "No Account Found on CommunityTaught.org",
			text: "We recently received a request to reset the password for an account using this email address. However, no such account exists.",
			html: `<h3>No Account Found</h3><p>We recently received a request to reset the password for an account using this email address. However, no such account exists.</p>`,
		});
	}

	req.session.flash = {
		type: "success",
		message: [`A reset password link has been sent to ${email}`],
	};
	res.redirect(redirects.forgot);
};
