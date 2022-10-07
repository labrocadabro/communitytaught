import express from 'express';
import passport from 'passport';
import { Octokit } from "@octokit/core";
import { createOAuthUserAuth } from "@octokit/auth-oauth-user";
import dotenv from 'dotenv';

import User from '../models/User.js';

dotenv.config();

const router = express.Router();


// GOOGLE
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard');
  });

router.get('/google/revoke', async (req, res) => {
	if (unlinkGoogle(req)) {
		req.session.flash = { type: 'success', message: ['Google acocunt unlinked successfully'] };
		res.redirect('/account');
	} else {
		req.session.flash = { type: 'error', message: ["Could not unlink account"] };
		res.redirect('/account');
	}
});

export const unlinkGoogle = async (req) => {
	try {
		const token = req.user.googleToken;
		const res = await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`, {
			method: 'post',
			headers: { 'content-type': 'application/x-www-form-urlencoded' }
		});
		const data = await res.json();
		if ( data.error ) throw new Error();
		const user = await User.findById(req.user._id);
		user.googleId = null;
		user.googleToken = null;
		await user.save();
		return true;
	} catch (err) {
		return false;
	}	
}


// GITHUB

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard');
  });

router.get('/github/revoke', async (req, res) => {
	if (unlinkGithub(req)) {
		req.session.flash = { type: 'success', message: ['Github account unlinked successfully'] };
		res.redirect('/account');
	} else {
		req.session.flash = { type: 'error', message: ["Could not unlink account."] };
		res.redirect('/account');
	}
});

export const unlinkGithub = async (req) => {
	try {
		const octokit = new Octokit({
			authStrategy: createOAuthUserAuth,
			auth: {
				clientId: process.env.GITHUB_ID,
				clientSecret:  process.env.GITHUB_SECRET,
			},
		});   
		await octokit.request(`DELETE /applications/${process.env.GITHUB_ID}/grant`, { access_token: req.user.githubToken });
		const user = await User.findById(req.user._id);
		user.githubId = null;
		user.githubToken = null;
		await user.save();
		return true;
	} catch (err) {
		return false;
	}	
}


export default router;