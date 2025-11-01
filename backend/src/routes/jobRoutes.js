import express from 'express';
import {
  createJob,
  getJobs,
  getNearbyJobs,
  getJobById,
  updateJob,
  acceptJob,
  deleteJob,
} from '../controllers/jobController.js';
import { userAuth, authorize } from '../middlewares/authMiddleware.js';
import { wrapAsync } from '../middlewares/wrapAsync.js';

const router = express.Router();