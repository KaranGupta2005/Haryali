import express from "express";
import { newListing, getAllListings } from "../controllers/farmerController.js";
import { wrapAsync } from "../middlewares/wrapAsync.js";
import { validateParali } from "../middlewares/validate.js";

const router = express.Router();

router.post("/", validateParali, wrapAsync(newListing));

router.get("/", wrapAsync(getAllListings));

export default router;

