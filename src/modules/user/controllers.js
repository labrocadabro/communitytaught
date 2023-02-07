import Lesson from "../lesson/models/Lesson.js";

import { getLessonProgress } from "../lesson/controllers.js";

export const dashboard = async (req, res) => {
	if (!req.isAuthenticated()) return notLoggedIn(req, res);
	let currentLesson;
	if (req.user.currentClass) {
		currentLesson = await Lesson.findById(req.user.currentClass);
		currentLesson = await getLessonProgress(req.user.id, currentLesson);
	}
	res.render("dashboard", { lesson: currentLesson });
};

export const settings = (req, res) => {
	if (!req.isAuthenticated()) return notLoggedIn(req, res);
	res.render("settings");
};

export const account = (req, res) => {
	if (!req.isAuthenticated()) return notLoggedIn(req, res);
	res.render("account");
};
