import mongoose from "mongoose";

const Schema = mongoose.Schema;

const homeworkItemSchema = new Schema({ 
	itemIndex: Number,
	description: String,
	pushWork: Boolean,
	required: Boolean
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
	}
});

export default mongoose.model('Homework', homeworkSchema);
