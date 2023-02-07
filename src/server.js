import dotenv from "dotenv";
import morgan from "morgan";
import passport from "passport";

import { app } from "./app.js";

import connectDB from "./db.js";

dotenv.config();
morgan(":method :url :status :res[content-length] - :response-time ms");

const port = process.env.PORT;

connectDB();

app.listen(port, () => console.log(`Server is running on port ${port}`));
