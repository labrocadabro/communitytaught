import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import validator from 'validator';

import User from '../models/User.js';
import Token from '../models/Token.js';

dotenv.config();

const transport = nodemailer.createTransport({
	// test server using Mailhog
	host: "0.0.0.0",
	port: 1025
	// host: process.env.SMTP_SERVER,
  // port: process.env.SMTP_PORT,
  // secure: true,
  // auth: {
  //   user: process.env.SMTP_USER,
  //   pass: process.env.SMTP_PASS,
	// }
});

export const verify = async (req, res) => {
	const email = req.user.username;
	if (!req.user.verified) {
		const token = crypto.randomBytes(32).toString('hex');
		await new Token({token, email}).save();
		const url = `${process.env.DOMAIN}/verify?token=${token}`;
		await transport.sendMail({
			from: process.env.FROM_EMAIL,
			to: email,
			subject: "Please verify your account",
			text: `To verify your account, please copy and paste this link into your browser: ${url}`,
			html: `<h3>Verify your account</h3><p>Please click <a href="${url}">this link</a> to verify your account</p>` 
		})
	}
	res.redirect(req.session.returnTo || '/dashboard');
};

export const forgot = async (req, res) => {
	if (!validator.isEmail(req.body.username)) {
		req.session.flash = { type: "error", message: "Please enter a valid email address." };
		return res.redirect('/forgot');
	}
	const email = req.body.username;
	const user = await User.findOne({ username: email });
	// will need some logic here to handle 3rd party logins that don't have passwords
	let token = null;
	if (user) {
		token = crypto.randomBytes(32).toString('hex');
		await new Token({token, email}).save();
	}
	if (token) {
		const url = `${process.env.DOMAIN}/reset?token=${token}`;
		await transport.sendMail({
			from: process.env.FROM_EMAIL,
			to: email,
			subject: "Reset Password",
			text: `To reset your password, please copy and paste this link into your browser: ${url}`,
			html: `<h3>Reset Password</h3><p>Please click <a href="${url}">this link</a> to reset your password</p>` 
		})
	} else {
		await transport.sendMail({
			from: process.env.FROM_EMAIL,
			to: email,
			subject: "No Account Found",
			text: "We recently received a request to reset the password for an account using this email address. However, no such account exists.",
			html: `<h3>No Account Found</h3><p>We recently received a request to reset the password for an account using this email address. However, no such account exists.</p>` 
		})
	}
	
	req.session.flash = { type: 'success', message: [`A reset password link has been sent to ${email}`]}
	res.redirect('/forgot');
}