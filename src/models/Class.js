import mongoose from "mongoose";

const Schema = mongoose.Schema;

const classSchema = new Schema({
	video: {
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
	},
	motivation: {
		type: [String]
	},
	homework: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Homework"
	},
	done: {
		type: Boolean,
		default: false
	}
});

export default mongoose.model('Class', classSchema);
