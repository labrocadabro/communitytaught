import mongoose from "mongoose";

const Schema = mongoose.Schema;

const homeworkProgressSchema = new Schema({
	homework: { type: mongoose.Types.ObjectId, ref: 'Homework' },
	user: { type: mongoose.Types.ObjectId, ref: 'User' },
	submitted: { type: Boolean, default: false }
});



homeworkProgressSchema.statics.toggleItem = async function(itemId, hwId, userId) {
	let progress = await this.findOne({ user: userId, homework: hwId});
	if (progress) {
		let item = progress.itemProgress.find(p => p.item.toString() === itemId);
		if (item) {
			item.done = !item.done;
		} else {
			item = { item: itemId, done: true };
			progress.itemProgress.push(item);
		}
	} else {
		progress = new this({ user: userId, homework: hwId, submitted: false, itemProgress: [{ item: itemId, done: true }]});
	}
	await progress.save();
}


homeworkProgressSchema.statics.toggleExtra = async function(extraId, hwId, userId) {
	let progress = await this.findOne({ user: userId, homework: hwId});
	if (progress) {
		let extra = progress.extraProgress.find(p => p.extra.toString() === extraId);
		if (extra) {
			extra.done = !extra.done;
		} else {
			extra = { extra: extraId, done: true };
			progress.extraProgress.push(extra);
		}
	} else {
		progress = new this({ user: userId, homework: hwId, submitted: false, extraProgress: [{ extra: extraId, done: true }]});
	}
	await progress.save();
}




export default mongoose.model('HomeworkProgress', homeworkProgressSchema);