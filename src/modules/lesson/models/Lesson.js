import mongoose from "mongoose";

const Schema = mongoose.Schema;

const classSchema = new Schema({
	number: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
});

const MotivationSchema = new Schema({
	title: String,
	link: String,
});

const TimestampSchema = new Schema({
	time: Number,
	title: String,
});

const lessonSchema = new Schema({
	classes: {
		type: [classSchema],
		required: true,
	},
	title: {
		type: String,
		required: true,
		unique: true,
	},
	videoId: {
		type: String,
	},
	videoType: {
		type: String,
		enum: ["youtube", "twitch", "none"],
		default: "youtube",
	},
	permalink: {
		type: String,
		unique: true,
	},
	thumbnail: {
		type: String,
		required: true,
	},
	slides: {
		type: [String],
	},
	materials: {
		type: [String],
	},
	checkins: {
		type: [String],
	},
	motivation: {
		type: MotivationSchema,
	},
	timestamps: [TimestampSchema],
	cohort: {
		type: Number,
		enum: [2, 3],
		required: true,
		default: 2,
	},
	note: String,
});

export default mongoose.model("Lesson", lessonSchema);
