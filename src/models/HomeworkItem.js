import mongoose from "mongoose";

const Schema = mongoose.Schema;

const homeworkItemSchema = new Schema({ 
	homework: { type: mongoose.Types.ObjectId, ref: 'Homework' },
	itemIndex: Number,
	class: Number,
	due: Number,
	description: String,
	required: {
		type: Boolean,
		default: false
	}
});

export default mongoose.model('HomeworkItem', homeworkItemSchema);