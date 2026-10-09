import {Router} from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getAllcategory,addCategory } from "../controllers/category.controllers.js";
const router = Router();

router.route("/").get(getAllcategory);
router.route("/addCategory").post(upload.single("image"),addCategory);
export default router;