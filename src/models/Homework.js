import mongoose from "mongoose";

const Schema = mongoose.Schema;

const homeworkItemSchema = new Schema({ 
	itemIndex: Number,
	class: Number,
	due: Number,
	description: String,
	required: {
		type: Boolean,
		default: false
	}
});

const homeworkSchema = new Schema({
	classNo: {
		type: [Number],
		required: true	
	},
	dueNo: {
		type: Number,
		required: true	
	},
	items: {
		type: [homeworkItemSchema]
	},
	extras: {
		type: [homeworkItemSchema]
	},
	submit: String,
	cohort: Number,
	note: String
});

export default mongoose.model('Homework', homeworkSchema);
