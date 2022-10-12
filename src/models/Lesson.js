import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TimestampSchema = new Schema({
	time: Number,
	title: String
});

const SlidesSchema = new Schema({
	class: Number,
	link: String
});

const lessonSchema = new Schema({
	videoId: {
		type: String
	},
	twitchVideo: {
		type:Boolean,
		default: false
	},
	title: {
		type: String,
		required: true
	},
	permalink: {
		type: String
	},
	dates: {
		type: [Date],
		required: true
	},
	classNo: {
		type: [Number]
	},
	thumbnail: {
		type: String,
		required: true
	},
	slides: {
		type: [SlidesSchema]
	},
	materials: {
		type: String
	},
	checkin: {
		type: [String]
	},
	motivationLink: {
		type: String
	},
	motivationTitle: {
		type: String
	},
	timestamps: [TimestampSchema],
	cohort: Number
});

export default mongoose.model('Lesson', lessonSchema);
