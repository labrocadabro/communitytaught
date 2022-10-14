import mongoose from "mongoose";

const Schema = mongoose.Schema;

const lessonProgressSchema = new Schema({
	lesson: {type: mongoose.Types.ObjectId, ref: 'Lesson' },
	user: {type: mongoose.Types.ObjectId, ref: 'User' },
	watched: { type: Boolean, default: false },
	checkedIn: { type: Boolean, default: false }
});

lessonProgressSchema.statics.toggleWatched = async function(lessonId, userId) {
	let progress = await this.findOne({ lesson: lessonId, user: userId});
	if (progress) {
		progress.watched = !progress.watched;
	} else {
		progress = new this({ lesson: lessonId, user: userId, watched: true, checkedIn: false });
	}
	await progress.save();
}

lessonProgressSchema.statics.toggleCheckedIn = async function(lessonId, userId) {
	let progress = await this.findOne({ lesson: lessonId, user: userId});
	if (progress) {
		progress.checkedIn = !progress.checkedIn;
	} else {
		progress = new this({ lesson: lessonId, user: userId, watched: false, checkedIn: true });
	}
	await progress.save();
}


export default mongoose.model('LessonProgress', lessonProgressSchema);