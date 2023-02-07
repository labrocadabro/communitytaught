import Lesson from "../lesson/models/Lesson.js";

import { getLessonProgress } from "../lesson/controllers.js";

import { notLoggedIn } from "../auth/controllers.js";

export const dashboard = async (req, res) => {
	if (!req.isAuthenticated()) return notLoggedIn(req, res);
	let currentLesson;
	if (req.user.currentClass) {
		currentLesson = await Lesson.findById(req.user.currentClass);
		currentLesson = await getLessonProgress(req.user.id, currentLesson);
	}
	res.render("user/dashboard", { lesson: currentLesson });
};

export const settings = (req, res) => {
	if (!req.isAuthenticated()) return notLoggedIn(req, res);
	res.render("user/settings");
};

export const account = (req, res) => {
	if (!req.isAuthenticated()) return notLoggedIn(req, res);
	res.render("user/account");
};
