import morgan from "morgan";

import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";

import connectDB from "./db.js";

morgan(":method :url :status :res[content-length] - :response-time ms");

const port = process.env.PORT;

connectDB();

app.listen(port, () => console.log(`Server is running on port ${port}`));
