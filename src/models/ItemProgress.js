import mongoose from "mongoose";

const Schema = mongoose.Schema;

const itemProgresstemSchema = new Schema({ 
	item: { type: mongoose.Types.ObjectId, ref: 'HomeworkItem' },
	user: { type: mongoose.Types.ObjectId, ref: 'User' },
	done: {
		type: Boolean,
		default: false
	}
});

export default mongoose.model('ItemProgress', itemProgresstemSchema);