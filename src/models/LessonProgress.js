import mongoose from "mongoose";

const Schema = mongoose.Schema;

const lessonProgressSchema = new Schema({
	lesson: {type: mongoose.Types.ObjectId, ref: 'Lesson' },
	user: {type: mongoose.Types.ObjectId, ref: 'User' },
	watched: { type: Boolean, default: false },
	checkedIn: { type: Boolean, default: false }
});

export default mongoose.model('LessonProgress', lessonProgressSchema);