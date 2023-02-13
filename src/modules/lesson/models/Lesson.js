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
	title: {
		type: String,
		trim: true,
	},
	link: {
		type: String,
		trim: true,
	},
});

const TimestampSchema = new Schema({
	time: Number,
	title: {
		type: String,
		trim: true,
	},
});

const lessonSchema = new Schema({
	classes: {
		type: [classSchema],
		required: true,
	},
	title: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
	videoId: {
		type: {
			type: String,
			trim: true,
		},
	},
	videoType: {
		type: String,
		enum: ["youtube", "twitch", "none"],
		default: "youtube",
	},
	permalink: {
		type: String,
		trim: true,
		index: {
			unique: true,
			partialFilterExpression: { permalink: { $type: "string" } },
		},
	},
	thumbnail: {
		type: String,
		trim: true,
		required: true,
	},
	slides: {
		type: [
			{
				type: String,
				trim: true,
			},
		],
		default: undefined,
	},
	materials: {
		type: [
			{
				type: String,
				trim: true,
			},
		],
		default: undefined,
	},
	checkins: {
		type: [
			{
				type: String,
				trim: true,
			},
		],
		default: undefined,
	},
	motivation: {
		type: MotivationSchema,
	},
	timestamps: { type: [TimestampSchema], default: undefined },
	cohort: {
		type: Number,
		enum: [2, 3],
		required: true,
		default: 2,
	},
	note: {
		type: String,
		trim: true,
	},
});

export default mongoose.model("Lesson", lessonSchema);
