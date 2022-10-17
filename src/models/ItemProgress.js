import mongoose from "mongoose";

const Schema = mongoose.Schema;

const itemProgressSchema = new Schema({ 
	item: { type: mongoose.Types.ObjectId, ref: 'HomeworkItem' },
	user: { type: mongoose.Types.ObjectId, ref: 'User' },
	done: {
		type: Boolean,
		default: false
	}
});


itemProgressSchema.statics.toggleItem = async function(itemId, userId) {
	let item = await this.findOne({ item: itemId, user: userId });
	if (item) {
			item.done = !item.done;
		} else {
			item = await new this({ item: itemId, user: userId, done: true });
		}
	await item.save();
}

export default mongoose.model('ItemProgress', itemProgressSchema);