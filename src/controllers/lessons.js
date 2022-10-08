import Lesson from '../models/Lesson.js';
import LessonProgress from '../models/LessonProgress.js';

export const addLessonForm = (req, res) => {
	res.render("addLesson");
};
export const addLesson = async (req, res) => {
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
	let lessons;
	if (req.isAuthenticated()) {
		lessons = await Lesson.aggregate()
		.lookup({ 
			from: 'lessonprogresses', 
			localField: '_id', 
			foreignField: 'lesson',
			as: 'progress' 
		});
		lessons = lessons.map(lesson => {
			if(lesson.progress.length) {
				const progress = lesson.progress.find( progress => progress.user == req.user.id);
				lesson.watched = progress.watched;
				lesson.checkedIn = progress.checkedIn;
			} else {
				lesson.watched = false;
				lesson.checkedIn = false;
			}
			return lesson;
		});

	} else {
		lessons = await Lesson.find();
	}
	res.render('allLessons', {lessons})
}

export const showLesson =  async (req, res) => {
	try {
		const lesson = await Lesson.findOne({permalink: req.params.permalink});
		const lessonProgress = await LessonProgress.findOne({lesson: lesson._id});
		let next = await Lesson.findOne({classNo: {$in: [lesson.classNo.at(-1) + 1]}});
		next = next ? next.permalink : null;
		let prev = await Lesson.findOne({classNo: {$in: [lesson.classNo[0] - 1]}});
		prev = prev ? prev.permalink : null;
		lesson.watched = lessonProgress.watched;
		lesson.checkedIn = lessonProgress.checkedIn;
		res.render('lesson', {lesson, next, prev, watched: lessonProgress.watched, checkedin: lessonProgress.checkedIn});
	} catch (err) {
		console.log(err);
	}
	
}


export const toggleWatched =  async (req, res) => {
	try {
		await LessonProgress.toggleWatched(req.params.id, req.user.id);
		res.json("toggled watched");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 	
}

export const toggleCheckedIn =  async (req, res) => {
	try {
		await LessonProgress.toggleCheckedIn(req.params.id, req.user.id);
		res.json("toggled checked in");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 
}