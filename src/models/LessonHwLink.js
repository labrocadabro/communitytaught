import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LessonHwLinkSchema = new Schema({
	lesson: { type: mongoose.Types.ObjectId, ref: 'Lesson' },
	hwAssigned: { type: [mongoose.Types.ObjectId], ref: 'Homework' },
	hwDue: { type: [mongoose.Types.ObjectId], ref: 'Homework' }
});

export default mongoose.model('LessonHwLink', LessonHwLinkSchema);
