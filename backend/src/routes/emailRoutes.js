import express from "express";
import {
  saveEmail,
  sendNewsletterEmail,
  saveContactMessage,
} from "../controllers/emailController.js";
import { userAuth, authorize } from "../middlewares/authMiddleware.js";
import { wrapAsync } from "../middlewares/wrapAsync.js";
import {
  validateEmailSubscription,
  validateContactMessage,
  validateNewsletter,
} from "../middlewares/emailValidator.js";

const router = express.Router();

router.post("/subscribe", validateEmailSubscription, wrapAsync(saveEmail));
router.post("/contact", validateContactMessage, wrapAsync(saveContactMessage));

router.post(
  "/send-newsletter",
  userAuth,
  authorize(["admin"]),
  validateNewsletter,
  wrapAsync(sendNewsletterEmail)
);

export default router;