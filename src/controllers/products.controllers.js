 import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Product from "../models/product.models.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const getAllProducts = asyncHandler(async (req, res) => {
const products = await Product.find();
if(products[0]===undefined)
{throw new ApiError(404,"No products found");}
return res.status(200).json(new ApiResponse(200,products,"Products fetched successfully"))
});
export { getAllProducts }