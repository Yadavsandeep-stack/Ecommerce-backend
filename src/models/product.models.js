import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [150, "Name is too long"],
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    brand: { type: String, trim: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        index: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
    },
    discountPrice: {
        type: Number,
        min: 0,
        validate: {
            validator: function (v) {
                return v == null || v < this.price
            },
            message: "Discount price must be less than price",
        },
    },
    images: [
        {
            url: { type: String, required: true },
            alt: String,
        },
    ],
    stock: {
        type: Number,
        required: true,
        min: [0, "Stock cannot be negative"],
        default: 0,
    },
    sku: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },

    attributes: {
        type: Map,
        of: String,
    },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true })


productSchema.index({ name: "text", description: "text", brand: "text" })

const Product = mongoose.model("Product", productSchema)

export default Product
