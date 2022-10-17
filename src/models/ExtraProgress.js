import mongoose from "mongoose";

const Schema = mongoose.Schema;

const extraProgresstemSchema = new Schema({ 
	extra: { type: mongoose.Types.ObjectId, ref: 'HomeworkExtra' },
	user: { type: mongoose.Types.ObjectId, ref: 'User' },
	done: {
		type: Boolean,
		default: false
	}
});

export default mongoose.model('ExtraProgress', extraProgresstemSchema);