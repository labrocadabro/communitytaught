import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const getDBUri = () => {
    return process.env.MONGODB_URI;
}

const connectDB = async () => {
    try {
		mongoose.set("strictQuery", true);
        const conn = await mongoose.connect(getDBUri(), {})

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

export default connectDB;
