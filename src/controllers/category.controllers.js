import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Category from "../models/category.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllcategory = asyncHandler(async (req, res) => {

    const category = await Category.find();

    if (!category) {
        throw new ApiError(404, "Problem in fetching the Category");
    }

    if (category.length === 0) {
        throw new ApiError(404, "Category list is empty");
    }

    return res.status(200)
        .json(new ApiResponse(200, category, "Categories Fetched successfully"));
});

const addCategory = asyncHandler(async (req, res) => {

    const { name, slug, description, parent, isActive } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!name || !slug) {
        throw new ApiError(400, "Name and slug are required");
    }

    let url = null;

    if (req.file) {

        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

        if (!cloudinaryResponse) {
            throw new ApiError(500, "Image upload failed");
        }

        url = cloudinaryResponse.secure_url;
    }

    const category = await Category.create({
        name,
        slug,
        description,
        image: url,
        parent: parent || null,
        isActive: isActive === undefined
            ? true
            : isActive === "true"
    });

    return res.status(201)
        .json(new ApiResponse(
            201,
            category,
            "Category created successfully"
        ));
});

export { getAllcategory, addCategory };