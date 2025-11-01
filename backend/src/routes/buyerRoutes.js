import express from "express";
import {
  placeOrder,
  getBuyerOrders,
  updateOrderStatus,
} from "../controllers/buyerController.js";
import { wrapAsync } from "../middlewares/wrapAsync.js";
import { validateBuyer } from "../middlewares/validate.js";

const router = express.Router();

router.post("/", validateBuyer, wrapAsync(placeOrder));
router.get("/", wrapAsync(getBuyerOrders));
router.put("/:id/status", wrapAsync(updateOrderStatus));

export default router;


