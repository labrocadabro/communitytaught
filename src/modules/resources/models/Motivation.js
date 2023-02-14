import mongoose from "mongoose";

const motivationSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: true,
	},
	link: {
		type: String,
		trim: true,
		required: true,
	},
});

export default mongoose.model("Motivation", motivationSchema);
