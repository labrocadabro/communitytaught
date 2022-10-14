import mongoose from "mongoose";

const Schema = mongoose.Schema;

const homeworkItemProgressSchema = new Schema({
	item:  { type: mongoose.Types.ObjectId, ref: 'HomeworkItem' },
	done: { type: Boolean, default: false }
});

const homeworkExtraProgressSchema = new Schema({
	extra:  { type: mongoose.Types.ObjectId, ref: 'HomeworkExtra' },
	done: { type: Boolean, default: false }
});

const homeworkProgressSchema = new Schema({
	homework: { type: mongoose.Types.ObjectId, ref: 'Lesson' },
	user: { type: mongoose.Types.ObjectId, ref: 'User' },
	itemProgress: [homeworkItemProgressSchema],
	extraProgress: [homeworkExtraProgressSchema],
	submitted: { type: Boolean, default: false }
});

export default mongoose.model('HomeworkProgress', homeworkProgressSchema);