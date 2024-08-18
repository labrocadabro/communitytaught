import express from "express";
import path from "path";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import morgan from "morgan";
import * as url from "url";

import dotenv from "dotenv";
dotenv.config();

import { default as connectMongoDBSession } from "connect-mongodb-session";
const MongoDBStore = connectMongoDBSession(session);

import connectDB from "./config/db.js";
import google from "./config/googleAuth.js";
import github from "./config/githubAuth.js";

import User from "./models/User.js";

import auth from "./middleware/auth.js";
import flash from "./middleware/flash.js";

import mainRouter from "./routes/mainRouter.js";
import emailRouter from "./routes/emailRouter.js";
import oauthRouter from "./routes/oauthRouter.js";
import lessonRouter from "./routes/lessonRouter.js";
import hwRouter from "./routes/hwRouter.js";

// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

morgan(":method :url :status :res[content-length] - :response-time ms");

const app = express();
const port = process.env.PORT;

app.set("views", "./src/views");
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "assets")));
app.use(cors());

// app.use((req, res, next) => {
// 	res.render("maintenance");
// });

const store = new MongoDBStore({
	uri: process.env.DB_URI,
	collection: "sessions",
});

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 60 * 60 * 1000 * 24 * 7 }, // 1 week
		store,
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
app.use("/email", emailRouter);
app.use("/oauth", oauthRouter);
app.use("/class", lessonRouter);
app.use("/hw", hwRouter);
app.use((req, res, next) => {
	res.status(404).render("404");
});

connectDB();

app.listen(port, () => console.log(`Server is running on port ${port}`));
