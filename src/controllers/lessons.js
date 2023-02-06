import mongoose from "mongoose";

import Lesson from "../models/Lesson.js";
import User from "../models/User.js";
import LessonProgress from "../models/LessonProgress.js";
import Homework from "../models/Homework.js";

import { getHwProgress } from "./homework.js";

export const addEditLessonForm = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	const edit = !!req.params.id;
	let lesson = null;
	if (edit) {
		lesson = await Lesson.findById(req.params.id).lean();
		lesson.classNo = lesson.classNo.join(",");
		lesson.checkin = lesson.checkin.join(",");
		lesson.slides = lesson.slides.join(",");
		lesson.dates = lesson.dates
			.map((date) => {
				return date.toISOString().split("T")[0];
			})
			.join(",");
	}
	res.render("addLesson", { edit, lesson });
};

export const addEditLesson = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	try {
		let dates = [];
		if (req.body.date) {
			dates = req.body.date.split(",").map((date) => new Date(date));
		}
		let slides = [];
		const timestamps = [];
		for (let i = 0; i < req.body.tsTime.length; i++) {
			timestamps.push({
				time: Number(req.body.tsTime[i]),
				title: req.body.tsTitle[i],
			});
		}
		const lessonData = {
			videoId: req.body.videoId,
			twitchVideo: !!req.body.twitch ? true : false,
			title: req.body.videoTitle,
			dates: dates,
			permalink: req.body.permalink,
			thumbnail: req.body.thumbnail,
			classNo: req.body.number ? req.body.number.split(",") : [],
			slides: req.body.slides ? req.body.slides.split(",") : [],
			materials: req.body.materials,
			checkin: req.body.checkin ? req.body.checkin.split(",") : [],
			motivationLink: req.body.motivationLink,
			motivationTitle: req.body.motivationTitle,
			cohort: req.body.cohort,
			note: req.body.note,
			timestamps: timestamps,
		};
		const lesson = await Lesson.findByIdAndUpdate(
			req.params.id || mongoose.Types.ObjectId(),
			lessonData,
			{ upsert: true, new: true }
		);

		// if this is a new class, update all users with current class = null so this is now their current class
		if (!req.params.id) {
			await User.updateMany(
				{ currentClass: null },
				{ currentClass: lesson._id }
			);
		}
		req.session.flash = {
			type: "success",
			message: [`Class ${!!req.params.id ? "updated" : "added"}`],
		};
	} catch (err) {
		console.log(err);
		req.session.flash = {
			type: "error",
			message: [`Class not ${!!req.params.id ? "updated" : "added"}`],
		};
	} finally {
		res.redirect("/class/add");
	}
};

export const getAllLessonsProgress = async (userId, lessons) => {
	const lessonProgress = await LessonProgress.find({ user: userId }).lean();
	const lessonsObj = {};
	lessonProgress.forEach((p) => {
		lessonsObj[p.lesson] = {
			watched: p.watched,
			checkedIn: p.checkedIn,
		};
	});
	lessons.forEach((lesson) => {
		const prog = lessonsObj[lesson._id];
		lesson.watched = prog ? !!prog.watched : false;
		lesson.checkedIn = prog ? !!prog.checkedIn : false;
	});
	return lessons;
};

export const allLessons = async (req, res) => {
	let lessons = await Lesson.find().lean().sort({ _id: 1 });
	if (req.isAuthenticated()) {
		lessons = await getAllLessonsProgress(req.user.id, lessons);
	}
	res.render("allLessons", { lessons });
};

export const getLessonProgress = async (userId, lesson) => {
	const progress = await LessonProgress.findOne({
		user: userId,
		lesson: lesson._id,
	});
	lesson.watched = progress ? progress.watched : false;
	lesson.checkedIn = progress ? progress.checkedIn : false;
	return lesson;
};

export const showLesson = async (req, res) => {
	try {
		let lesson = await Lesson.findOne({
			permalink: req.params.permalink,
		}).lean();
		let next = await Lesson.find({ _id: { $gt: lesson._id } })
			.sort({ _id: 1 })
			.limit(1);
		next = next.length ? next[0].permalink : null;
		let prev = await Lesson.find({ _id: { $lt: lesson._id } })
			.sort({ _id: -1 })
			.limit(1);
		prev = prev.length ? prev[0].permalink : null;
		let assigned = await Homework.find({ classNo: { $in: lesson.classNo } })
			.lean()
			.sort({ _id: 1 })
			.populate(["items", "extras"]);
		let due = await Homework.find({ dueNo: { $in: lesson.classNo } })
			.lean()
			.sort({ _id: 1 })
			.populate(["items", "extras"]);

		if (req.isAuthenticated()) {
			lesson = await getLessonProgress(req.user.id, lesson);
			if (assigned.length)
				assigned = await getHwProgress(req.user.id, assigned);
			if (due.length) due = await getHwProgress(req.user.id, due);
		}
		res.render("lesson", { lesson, next, prev, assigned, due });
	} catch (err) {
		console.log(err);
		res.redirect("/class/all");
	}
};

export const deleteLesson = async (req, res) => {
	if (!req.user?.admin) return res.redirect("/");
	try {
		const lessonId = req.params.id;
		let next = await Lesson.find({ _id: { $gt: lessonId } })
			.sort({ _id: 1 })
			.limit(1);
		const nextId = next[0] ? next[0]._id : null;
		const res = await User.updateMany(
			{ currentClass: lessonId },
			{ currentClass: nextId }
		);
		await LessonProgress.deleteMany({ lesson: lessonId });
		await Lesson.deleteOne({ _id: lessonId });
	} catch (err) {
		console.log(err);
	} finally {
		res.redirect("/class/all");
	}
};

export const toggleWatched = async (req, res) => {
	if (!req.user) return res.status(401).json({ msg: "not logged in" });
	try {
		const userId = req.user.id;
		const lessonId = req.params.id;
		await LessonProgress.toggleWatched(lessonId, userId);
		res.json({ msg: "toggled lesson watched" });
	} catch (err) {
		console.log(err);
		res.status(err.status || 500).json({ error: err.message });
	}
};

export const toggleCheckedIn = async (req, res) => {
	if (!req.user) return res.status(401).json({ msg: "not logged in" });
	try {
		const userId = req.user.id;
		const lessonId = req.params.id;
		await LessonProgress.toggleCheckedIn(lessonId, req.user.id);
		res.json({ msg: "toggled lesson checked in" });
	} catch (err) {
		console.log(err);
		res.status(err.status || 500).json({ error: err.message });
	}
};
