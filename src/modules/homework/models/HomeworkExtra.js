import mongoose from "mongoose";

const Schema = mongoose.Schema;

const homeworkExtraSchema = new Schema({
	class: Number,
	due: Number,
	description: String
});

export default mongoose.model('HomeworkExtra', homeworkExtraSchema);
