import Lesson from '../models/Lesson.js';

export const addLessonForm = (req, res) => {
	res.render("addLesson");
};
export const addLesson = async (req, res) => {
	try{
		const lesson = {
			video: req.body.videoLink,
			title: req.body.videoTitle,
			permalink: req.body.permalink,
			thumbnail: req.body.thumbnail,
			classNo: req.body.number.split(","),
			slides: req.body.slidesLink,
			materials: req.body.materialsLink,
			checkin: req.body.checkinLink,
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