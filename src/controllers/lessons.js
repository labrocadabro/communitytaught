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
	const lessons = await Lesson.find();
	res.render('allLessons', {lessons})
}

export const showLesson =  async (req, res) => {
	const lesson = await Lesson.findOne({permalink: req.params.permalink});
	console.log(lesson)
	res.render('lesson', {lesson})
}


export const toggleWatched =  async (req, res) => {
	try {
		await LessonProgress.toggleWatched(req.params.id, "633fda11a7a0580712de9461");
		res.json("toggled watched");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 	
}

export const toggleCheckedIn =  async (req, res) => {
		try {
			res.json("toggled checked in");
		} catch (err) {
			console.log(err)
			res.json(err);
		} 
}