import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

console.log("1. index.js started");

dotenv.config({
    path: "./.env",
});

console.log("2. dotenv loaded");
console.log("3. PORT:", process.env.PORT);
console.log("4. MONGODB_URI exists:", !!process.env.MONGODB_URI);

const PORT = process.env.PORT || 8000;

console.log("5. Calling connectDB()");

connectDB()
    .then(() => {
        console.log("6. MongoDB connected, starting server...");

        app.listen(PORT, () => {
            console.log(`7. Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("8. MongoDB connection FAILED:", err);
    });