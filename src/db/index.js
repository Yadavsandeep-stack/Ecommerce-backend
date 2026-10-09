import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async () => {
    try {
        console.log("A. Starting MongoDB connection...");
        console.log("B. DB Name:", DB_Name);

        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_Name}`,
            {
                serverSelectionTimeoutMS: 5000,
            }
        );

        console.log(
            `C. MongoDB connected! DB HOST: ${connectionInstance.connection.host}`
        );

    } catch (err) {
        console.log("D. MONGODB connection FAILED");
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;