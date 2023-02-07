import mongoose from "mongoose";

const Schema = mongoose.Schema;

const homeworkProgressSchema = new Schema({
	homework: { type: mongoose.Types.ObjectId, ref: 'Homework' },
	user: { type: mongoose.Types.ObjectId, ref: 'User' },
	submitted: { type: Boolean, default: false }
});


homeworkProgressSchema.statics.toggleSubmitted = async function(hwaId, userId) {
	let homework = await this.findOne({ homework: hwaId, user: userId });
	if (homework) {
			homework.submitted = !homework.submitted;
		} else {
			homework = await new this({ homework: hwaId, user: userId, submitted: true });
		}
	await homework.save();
}

export default mongoose.model('HomeworkProgress', homeworkProgressSchema);