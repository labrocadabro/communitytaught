import mongoose from "mongoose";
import crypto from "crypto";

class Token {
	static generate() {
		return crypto.randomBytes(32).toString("hex");
	}
	static async getToken(token) {
		return await Token.findOne({ token });
	}
	static async saveNew(token, email) {
		await new this({ token, email }).save();
	}
	static async delete(token) {
		// if given req.body.token
		if (typeof token === "string") await this.findOneAndDelete({ token });
		// if given the token db object
		else await this.findByIdAndDelete(token._id);
	}
	verify(email) {
		return this.email === email;
	}
}

const tokenSchema = new mongoose.Schema({
	token: { type: String, required: true },
	email: { type: String, required: true },
	expires: { type: Date, default: Date.now, expires: 240 },
});

tokenSchema.loadClass(Token);

export default mongoose.model("Token", tokenSchema);
