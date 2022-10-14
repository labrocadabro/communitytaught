import mongoose from "mongoose";

const Schema = mongoose.Schema;

const homeworkExtraSchema = new Schema({
	homework: { type: mongoose.Types.ObjectId, ref: 'Homework' }, 
	extraIndex: Number,
	description: String
});

export default mongoose.model('HomeworkExtra', homeworkExtraSchema);
