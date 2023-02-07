import express from "express";
import path from "path";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import * as url from "url";

import dotenv from "dotenv";
dotenv.config();

import google from "./modules/auth/oauth/google.js";
import github from "./modules/auth/oauth/github.js";

import User from "./modules/user/models/User.js";

import auth from "./middleware/auth.js";
import flash from "./middleware/flash.js";

import mainRouter from "./modules/main/routes.js";
import authRouter from "./modules/auth/routes.js";
import userRouter from "./modules/user/routes.js";
import emailRouter from "./modules/email/routes.js";
import lessonRouter from "./modules/lesson/routes.js";
import hwRouter from "./modules/homework/routes.js";

// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export const app = express();

app.set("views", "./src/views");
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "assets")));
app.use(cors());
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 60 * 60 * 1000 * 24 }, // 1 day
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.use(google);
passport.use(github);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.current_url = req.path;
	res.locals.env = process.env.NODE_ENV;
	next();
});
app.use(auth);
app.use(flash);

app.use("/", mainRouter);
app.use("/", authRouter);
app.use("/email", emailRouter);
app.use("/class", lessonRouter);
app.use("/hw", hwRouter);
app.use("/user", userRouter);
app.use((req, res, next) => {
	res.status(404).render("404");
});
