import mongoose from "mongoose";

const Schema = mongoose.Schema;

const homeworkSchema = new Schema({
	classNo: {
		type: [Number],
		required: true	
	},
	dueNo: {
		type: Number,
		required: true	
	},
	submit: String,
	cohort: Number,
	note: String
});

export default mongoose.model('Homework', homeworkSchema);
