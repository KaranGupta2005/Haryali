import express from "express";
import {
  newListing,
  getAllListings,
  getMarketplaceListings,
  listForMarketplace,
} from "../controllers/farmerController.js";
import { wrapAsync } from "../middlewares/wrapAsync.js";
import { validateParali } from "../middlewares/validate.js";

const router = express.Router();

router.post("/", validateParali, wrapAsync(newListing));

router.get("/", wrapAsync(getAllListings));

router.get("/marketplace", wrapAsync(getMarketplaceListings));

router.put("/:id/list", wrapAsync(listForMarketplace));

export default router;


