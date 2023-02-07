import mongoose from "mongoose";

const Schema = mongoose.Schema;

const homeworkItemSchema = new Schema({ 
	class: Number,
	due: Number,
	description: String,
	required: {
		type: Boolean,
		default: false
	}
});

export default mongoose.model('HomeworkItem', homeworkItemSchema);