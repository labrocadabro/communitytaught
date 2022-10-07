import mongoose from "mongoose";

const Schema = mongoose.Schema;

const lessonSchema = new Schema({
	video: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	classNo: {
		type: [Number],
		required: true	
	},
	slides: {
		type: String
	},
	materials: {
		type: String
	},
	checkin: {
		type: String
	}
});

export default mongoose.model('Lesson', lessonSchema);
