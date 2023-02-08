import mongoose from "mongoose";

import User from "../models/User.js";
import Lesson from "../models/Lesson.js";
import { getAllLessonsProgress } from "../controllers/lessons.js";

const Schema = mongoose.Schema;

const lessonProgressSchema = new Schema({
	lesson: { type: mongoose.Types.ObjectId, ref: "Lesson" },
	user: { type: mongoose.Types.ObjectId, ref: "User" },
	watched: { type: Boolean, default: false },
	checkedIn: { type: Boolean, default: false },
	notes: String,
});

lessonProgressSchema.statics.toggleWatched = async function (lessonId, userId) {
	let progress = await this.findOne({ lesson: lessonId, user: userId });
	if (progress) {
		progress.watched = !progress.watched;
	} else {
		progress = new this({
			lesson: lessonId,
			user: userId,
			watched: true,
			checkedIn: false,
		});
	}
	await progress.save();
	let nextLessonId;
	// if the current lesson has been marked watched
	if (progress.watched) {
		// check to see if there are any lessons after this one
		// we sort in reverse order because node doesn't support findLastIndex
		let nextLessons = await Lesson.find({
			_id: { $gt: lessonId },
			videoId: { $ne: "" },
		})
			.lean()
			.sort({ _id: -1 });
		if (nextLessons.length) {
			// if there are more lessons, we need to find the last lesson that has been watched
			nextLessons = await getAllLessonsProgress(userId, nextLessons);
			const watchedLessonIndex = nextLessons.findIndex(
				(lesson) => lesson.watched
			);
			if (watchedLessonIndex !== -1) {
				// if we found a lesson that has been watched, we want to set the lesson id to the next lesson but it is possible a next lesson doesn't exist, in which case it should be null instead
				const nextLesson = nextLessons[watchedLessonIndex - 1] || null;
				nextLessonId = nextLesson ? nextLesson._id : null;
			} else {
				// if no other lessons have been watched, set the lesson id to the next lesson in the list
				// because we sorted in reverse, that is the last lesson in the array
				nextLessonId = nextLessons.at(-1)._id;
			}
		} else {
			// if there are no more lessons, set lesson id to null
			nextLessonId = null;
		}
	} else {
		// if the lesson was marked unwatched, we want to find the first unwatched lesson
		let prevLessons = await Lesson.find({
			_id: { $lt: lessonId },
			videoId: { $ne: "" },
		})
			.lean()
			.sort({ _id: 1 });
		if (prevLessons.length) {
			// if there are previous lessons, find the first unwatched lesson. If no previous unwatched lessons are found, use the current lesson id
			prevLessons = await getAllLessonsProgress(userId, prevLessons);
			const unwatchedLesson = prevLessons.find((lesson) => !lesson.watched);
			nextLessonId = unwatchedLesson ? unwatchedLesson._id : lessonId;
		} else {
			// if there are no previous lessons, set lesson id to current lesson
			nextLessonId = lessonId;
		}
	}
	await User.findByIdAndUpdate(userId, { currentClass: nextLessonId });
};

lessonProgressSchema.statics.toggleCheckedIn = async function (
	lessonId,
	userId
) {
	let progress = await this.findOne({ lesson: lessonId, user: userId });
	if (progress) {
		progress.checkedIn = !progress.checkedIn;
	} else {
		progress = new this({
			lesson: lessonId,
			user: userId,
			watched: false,
			checkedIn: true,
		});
	}
	await progress.save();
};

export default mongoose.model("LessonProgress", lessonProgressSchema);
