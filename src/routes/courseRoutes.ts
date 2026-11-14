
import { Router } from "express";

import {
  createCourse,
  getAllCourses,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware";

import upload from "../middleware/uploadMiddleware";

const router = Router();

// PUBLIC ROUTES

// Get all published courses
router.get("/", getAllCourses);

// Get a single published course
router.get("/:slug", getCourseBySlug);

// PROTECTED INSTRUCTOR AND ADMIN ROUTES

// Create a course
router.post(
  "/",
  protect,
  authorize("instructor", "admin"),
  upload.single("image"),
  createCourse
);

// Update a course
router.put(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  upload.single("image"),
  updateCourse
);

// Delete a course
router.delete(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  deleteCourse
);

export default router;
