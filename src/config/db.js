import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const cluster = process.env.DB_CLUSTER;
const dbName = process.env.DB_NAME;
const url = `mongodb+srv://${user}:${pass}@${cluster}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

export default connectDB;
