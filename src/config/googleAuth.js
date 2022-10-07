import {Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

import User from "../models/User.js";

dotenv.config();

const google = new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.DOMAIN}/oauth/google/callback`,
  },
	async function(accessToken, refreshToken, profile, cb) {
		let user = await User.findOne( { googleId: profile.id });
		if (!user) {
			user = await User.findOne( { username: profile.emails[0].value });
			if (user) {
				user.googleId = profile.id;
			} else {
				user = new User({ 
					username: profile.emails[0].value, 
					googleId: profile.id, 
					hasPassword: false,
					verified: profile.emails[0].verified
				});
			}
		}
		user.googleToken = accessToken;
		await user.save();
		return cb(null, user);
	}
);

export default google;