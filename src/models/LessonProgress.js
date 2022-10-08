import mongoose from "mongoose";

const Schema = mongoose.Schema;

const lessonProgressSchema = new Schema({
	lesson: {
		type : mongoose.Types.ObjectId,
		ref: 'Lesson'
	},
	user: {
		type : mongoose.Types.ObjectId,
		ref: 'User'
	},
	watched: {
		type: Boolean,
		default: false
	},
	checkedIn: {
		type: Boolean,
		default: false
	}
});

lessonProgressSchema.statics.toggleWatched = async function(lessonId, userId) {
	let lessonProgress = await this.findOne({lesson: lessonId, user: userId});
	if (!lessonProgress) {
		lessonProgress = new this({lesson: lessonId, user: userId});
	}
	lessonProgress.watched = !lessonProgress.watched;
	await lessonProgress.save();
	}
	

export default mongoose.model('LessonProgress', lessonProgressSchema);
