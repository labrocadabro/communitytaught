import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
	// username and password are handled automatically by passport local mongoose
	verified: { type: Boolean, default: false },
	hasPassword: { type: Boolean, default: true },
	admin: { type: Boolean, default: false },
	googleId: String,
	googleToken: String,
	githubId: String,
	githubToken: String,
	currentClass: {
		type: mongoose.Types.ObjectId,
		ref: "Lesson",
		default: new mongoose.Types.ObjectId("634615b97755d907aa66bd97"),
	},
});

userSchema.plugin(passportLocalMongoose);
export default mongoose.model("User", userSchema);
