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
	items: {
		type: [homeworkItemSchema]
	},
	pwItems: {
		type: [homeworkItemSchema]
	},
});

const homeworkItemSchema = new Schema({ 
	description: String,
	pushWork: Boolean,
	required: Boolean
});

export default mongoose.model('Homework', homeworkSchema);
