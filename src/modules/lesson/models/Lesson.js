import mongoose from "mongoose";

import * as setters from "../../../utils/optionalFieldSetters.js";

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

const TimestampSchema = new Schema({
	time: { type: Number, required: true },
	title: {
		type: String,
		trim: true,
		required: true,
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
		type: String,
		trim: true,
		set: setters.setString,
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
		set: setters.setString,
	},
	thumbnail: {
		type: String,
		trim: true,
		set: setters.setString,
	},
	slides: {
		type: [
			{
				type: String,
				trim: true,
			},
		],
		set: setters.setArray,
		default: undefined,
	},
	materials: {
		type: [
			{
				type: String,
				trim: true,
			},
		],
		set: setters.setArray,
		default: undefined,
	},
	checkins: {
		type: [
			{
				type: String,
				trim: true,
			},
		],
		set: setters.setArray,
		default: undefined,
	},
	motivation: {
		type: Schema.Types.ObjectId,
		ref: "Motivation",
	},
	timestamps: {
		type: [TimestampSchema],
		default: undefined,
		set: setters.setObjectArray,
	},
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
