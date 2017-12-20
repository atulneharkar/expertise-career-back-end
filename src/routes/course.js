import express from 'express';

/* all controllers */
import {
  createCourse,
  getCourseList,
  updateCourse,
  setCourseImage,
  removeCourse
} from '../controllers/course';

/* pic upload */
import { avatarUpload } from '../helpers/upload';

const courseRoutes = express.Router();

/**
 * route to create a new course
 * POST /course/create
 */
courseRoutes.post('/create', createCourse);

/**
 * route to get list of courses
 * GET /course/list/:status [all, pending, active, inactive]
 */
courseRoutes.get('/list/:status', getCourseList);

/**
 * route to update specific course
 * PUT /course/:id
 */
courseRoutes.put('/:id', updateCourse);

/**
 * route to delete existing course
 * DELETE /course/new
 */
courseRoutes.delete('/:id', removeCourse);

/**
 * route to set course image
 * POST /course/courseImage
 */
courseRoutes.post('/courseImage', avatarUpload, setCourseImage);

export default courseRoutes;
