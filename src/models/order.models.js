import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    order_items: {
        type: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true, min: 0 },
                quantity: { type: Number, required: true, min: 1 },
            }
        ],
        validate: [(v) => v.length > 0, "Order must have at least one item"],
    },
    total_price: { type: Number, required: true, min: 0 },
    total_items: { type: Number, required: true, min: 1 },
    shipping_address: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        line1: { type: String, required: true },
        line2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        postal_code: { type: String, required: true },
        country: { type: String, required: true, default: "India" },
    },
    payment_method: {
        type: String,
        required: true,
        enum: ["COD", "UPI", "Card", "NetBanking"],
    },
    order_status: {
        type: String,
        required: true,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled", "Completed"],
        default: "Pending",
    },
    payment_status: {
        type: String,
        required: true,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
    },
    payment_id: { type: String },
    coupon: {
        code: String,
        discount: { type: Number, min: 0 },
    },
}, { timestamps: true })

orderSchema.index({ user_id: 1, createdAt: -1 })

const Order = mongoose.model("Order", orderSchema)

export default Order