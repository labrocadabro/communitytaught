import Lesson from '../models/Lesson.js';
import User from '../models/User.js';

export const addLessonForm = (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	res.render("addLesson");
};
export const addLesson = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	try{
		const lesson = {
			videoId: req.body.videoId,
			title: req.body.title,
			permalink: req.body.permalink,
			thumbnail: req.body.thumbnail,
			classNo: req.body.number.split(","),
			slides: req.body.slides,
			materials: req.body.materials,
			checkin: req.body.checkin,
		}
		await Lesson.create(lesson);
		req.session.flash = { type: "success", message: ['Class added']};
	} catch (err) {
		console.log(err);
		req.session.flash = { type: "error", message: ['Class not added']};
	} finally {
		res.redirect("/class/add");
	}
};
export const allLessons =  async (req, res) => {
	const lessons = await Lesson.find().lean();
	if (req.isAuthenticated()) {
		const user = await User.findById(req.user.id);
		lessons.map(lesson => {
			const progress = user.lessonProgress.find(prog => {
				return prog.lessonId.toString() === lesson._id.toString();
			})
			if (!progress) {
				lesson.watched = false;
				lesson.checkedIn = false;
			} else {
				lesson.watched = progress.watched;
				lesson.checkedIn = progress.checkedIn;
			}	
			return lesson;
		})
	}
	console.log(lessons)
	res.render('allLessons', {lessons})
}

export const showLesson =  async (req, res) => {
	try {
		const lesson = await Lesson.findOne({permalink: req.params.permalink});
		let progress;
		if (req.user) {
			const user = await User.findById(req.user.id);
			progress = user.lessonProgress.find(less => {
				return less.lessonId.toString() === lesson._id.toString();
			});
			if (!progress) {
				progress = { lessonId: lesson._id, watched: false, checkedIn: false };
				user.lessonProgress.push(progress);
				await user.save();
			}
		}
		let next = await Lesson.findOne({classNo: {$in: [lesson.classNo.at(-1) + 1]}});
		next = next ? next.permalink : null;
		let prev = await Lesson.findOne({classNo: {$in: [lesson.classNo[0] - 1]}});
		prev = prev ? prev.permalink : null;
		res.render('lesson', { lesson, next, prev, progress });
	} catch (err) {
		console.log(err);
	}
	
}


export const toggleWatched =  async (req, res) => {
	try {
		await User.toggleWatched(req.params.id, req.user.id);
		res.json("toggled watched");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 	
}

export const toggleCheckedIn =  async (req, res) => {
	try {
		await User.toggleCheckedIn(req.params.id, req.user.id);
		res.json("toggled checked in");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 
}