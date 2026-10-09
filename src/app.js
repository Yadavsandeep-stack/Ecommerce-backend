import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express"

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }

))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from './routes/user.routes.js'
import productRouter from './routes/products.routes.js'
import categoryRouter from './routes/category.routers.js'
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/categories', categoryRouter)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
        errors: err.errors || [],
    });
});

export { app }