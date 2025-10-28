import express from "express";
import {
  saveEmail,
  sendNewsletterEmail,
  saveContactMessage,
  getAllContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
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

router.get(
  "/contact-messages",
  userAuth,
  authorize(["admin"]),
  wrapAsync(getAllContactMessages)
);

router.patch(
  "/contact-messages/:id",
  userAuth,
  authorize(["admin"]),
  wrapAsync(updateContactMessageStatus)
);

router.delete(
  "/contact-messages/:id",
  userAuth,
  authorize(["admin"]),
  wrapAsync(deleteContactMessage)
);

export default router;