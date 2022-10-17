import mongoose from "mongoose";

const Schema = mongoose.Schema;

const homeworkProgressSchema = new Schema({
	homework: { type: mongoose.Types.ObjectId, ref: 'Homework' },
	user: { type: mongoose.Types.ObjectId, ref: 'User' },
	submitted: { type: Boolean, default: false }
});

export default mongoose.model('HomeworkProgress', homeworkProgressSchema);