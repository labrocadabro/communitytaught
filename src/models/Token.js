import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
	token: { type: String, required: true},
	email: { type: String, required: true},
	expires: { type: Date, default: Date.now, expires: 240}
});

export default mongoose.model('Token', tokenSchema);