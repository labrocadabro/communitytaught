import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

const classProgressSchema = new Schema({
	classNo: Number,
	watchted: Boolean,
	checkedIn: Boolean,
	motivation: Boolean
});

const hwItemProgressSchema = new Schema({
	classNo: Number,
	hwItemNo: Number,
	completed: Boolean
});

const hwProgressSchema = new Schema({
	classNo: Number,
	submitted: Boolean,
	items: [hwItemProgressSchema]
});

const userSchema = new Schema({
	// username and password are handled automatically by passport local mongoose
	verified: {type: Boolean, default: false},
	hasPassword: {type: Boolean, default: true},
	googleId: String,
	googleToken: String,
	githubId: String,
	githubToken: String,
	classProgress: [classProgressSchema],
	hwProgress: [hwProgressSchema]

});



userSchema.plugin(passportLocalMongoose);
export default mongoose.model('User', userSchema);
