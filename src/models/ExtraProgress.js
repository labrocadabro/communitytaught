import mongoose from "mongoose";

const Schema = mongoose.Schema;

const extraProgressSchema = new Schema({ 
	extra: { type: mongoose.Types.ObjectId, ref: 'HomeworkExtra' },
	user: { type: mongoose.Types.ObjectId, ref: 'User' },
	done: {
		type: Boolean,
		default: false
	}
});

extraProgressSchema.statics.toggleExtra = async function(extraId, userId) {
	let extra = await this.findOne({ extra: extraId, user: userId });
	if (extra) {
			extra.done = !extra.done;
		} else {
			extra = await new this({ extra: extraId, user: userId, done: true });
		}
	await extra.save();
}



export default mongoose.model('ExtraProgress', extraProgressSchema);