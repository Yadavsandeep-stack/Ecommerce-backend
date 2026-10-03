import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from './app.js'
dotenv.config({
    path: "./.env",
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
        console.log("MongoDB connected successfully")
    })
    .catch((err) => {
        console.log("MongoDB connection FAILED ", err)
    })







/*
import express from "express";

const app = express();

; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log("Database connected successfully")
        app.on("error", (err) => {
            console.log("Error: ", err)
            throw err
        })
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })

    }
    catch (err) {
        console.log("Error: ", err)
        throw err
    }
})()
*/