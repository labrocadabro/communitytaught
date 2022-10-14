import mongoose from "mongoose";

import Lesson from '../models/Lesson.js';
import LessonProgress from '../models/LessonProgress.js';
import User from '../models/User.js';

export const addEditLessonForm = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	const edit = !!req.params.id;
	let lesson = null;
	if (edit) {
		lesson = await Lesson.findById(req.params.id).lean();
		lesson.classNo = lesson.classNo.join(',');
		lesson.checkin = lesson.checkin.join(',');
		lesson.slides = lesson.slides.join(',');
		lesson.dates = lesson.dates.map(date => {
			return date.toISOString().split('T')[0];
		}).join(",");
	}
	res.render("addLesson", { edit, lesson });
};

export const addEditLesson = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	try{
		let dates = [];
		if (req.body.date) {
			dates = req.body.date.split(',').map(date => new Date(date));
		}
		let slides = [];
		const timestamps = [];
		for (let i = 0; i < req.body.tsTime.length; i++) {
			timestamps.push({
				time: Number(req.body.tsTime[i]),
				title: req.body.tsTitle[i],
			});
		}
		const lesson = {
			videoId: req.body.videoId,
			title: req.body.videoTitle,
			dates: dates,
			permalink: req.body.permalink,
			thumbnail: req.body.thumbnail,
			classNo: req.body.number.split(","),
			slides: req.body.slides.split(","),
			materials: req.body.materials,
			checkin: req.body.checkin.split(","),
			motivationLink: req.body.motivationLink,
			motivationTitle: req.body.motivationTitle,
			cohort: req.body.cohort,
			note: req.body.note,
			timestamps: timestamps
		}
		await Lesson.findByIdAndUpdate(req.params.id  || mongoose.Types.ObjectId(), lesson, {upsert: true});
		req.session.flash = { type: "success", message: [`Class ${!!req.params.id ? "updated" : "added"}`]};
	} catch (err) {
		console.log(err);
		req.session.flash = { type: "error", message: [`Class not ${!!req.params.id ? "updated" : "added"}`]};
	} finally {
		res.redirect("/class/add");
	}
};

export const allLessons =  async (req, res) => {
	const lessons = await Lesson.find().lean();
	lessons.forEach(lesson => lesson.classNo = lesson.classNo.join(", "));
	if (req.isAuthenticated()) {
		const progress = await LessonProgress.find({ user: req.user.id });
		lessons.forEach(lesson => {
			const prog = progress.find(p =>  p.lesson.toString() === lesson._id.toString())
			lesson.watched = prog ? prog.watched : false;
			lesson.checkedIn = prog ? prog.checkedIn : false;
		})
	}
	res.render('allLessons', {lessons})
};

export const showLesson =  async (req, res) => {
	try {
		const lesson = await Lesson.findOne({permalink: req.params.permalink}).lean();
		if (req.isAuthenticated()) {
			const progress = await LessonProgress.findOne({ user: req.user.id, lesson: lesson._id });
			lesson.watched = progress ? progress.watched : false;
			lesson.checkedIn = progress ? progress.checkedIn : false;
		}
		let next = await Lesson.find({_id: {$gt: lesson._id}}).sort({_id: 1}).limit(1);
		next = next.length ? next[0].permalink : null;
		let prev = await Lesson.find({_id: {$lt: lesson._id}}).sort({_id: -1}).limit(1);
		prev = prev.length ? prev[0].permalink : null;
		res.render('lesson', { lesson, next, prev });
	} catch (err) {
		console.log(err);
	}	
};

export const toggleWatched =  async (req, res) => {
	try {
		await LessonProgress.toggleWatched(req.params.id, req.user.id);
		res.json("toggled watched");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 	
};

export const toggleCheckedIn =  async (req, res) => {
	try {
		await LessonProgress.toggleCheckedIn(req.params.id, req.user.id);
		res.json("toggled checked in");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 
};