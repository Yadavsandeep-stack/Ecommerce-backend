import { Router } from "express";
import { getAllProducts } from "../controllers/products.controllers.js";
const router = Router()

router.route("/").get(getAllProducts)
export default router;