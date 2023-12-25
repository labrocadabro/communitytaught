import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const getDBUri = () => {
    const protocol = process.env.DB_PROTOCOL ?? 'mongodb+srv';
    const user = process.env.DB_USER;
    const pass = process.env.DB_PASS;
    let cluster = process.env.DB_CLUSTER;
    const dbName = process.env.DB_NAME;

    // If cluster is not set to localhost (aka local db),
    // add the existing suffix ".58qh2.mongodb.net" text to it as to not break existing deployed app.
    // TODO: this needs to be refactored to remove the hardcoded suffix and only use the cluster variable.
    if (!cluster.includes('localhost')) {
        cluster += ".58qh2.mongodb.net";
    }

    return `${protocol}://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority`;
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(getDBUri(), {
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