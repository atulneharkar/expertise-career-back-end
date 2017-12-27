import express from 'express';

/* all controllers */
import {
  createCourse,
  getCourseList,
  updateCourse,
  setCourseImage,
  removeCourse,
  getCourseByID,
  userCourse,
  getMyCourseList
} from '../controllers/course';

import { isAuthorizedUser } from '../middlewares/authenticate';

/* pic upload */
import { avatarUpload } from '../helpers/upload';

const courseRoutes = express.Router();

/**
 * route to create a new course
 * POST /course/create
 */
courseRoutes.post('/create', isAuthorizedUser, createCourse);

/**
 * route to get list of courses
 * GET /course/list/:status [all, pending, active, inactive]
 */
courseRoutes.get('/list/:status', getCourseList);

/**
 * route to get list of courses assigned to particular user
 * GET /course/list/me/:userId 
 */
courseRoutes.get('/list/me/:userId', getMyCourseList);

/**
 * route to get specific course's info
 * GET /course/:id
 */
courseRoutes.get('/:id', getCourseByID);

/**
 * route to update specific course
 * PUT /course/:id
 */
courseRoutes.put('/:id', isAuthorizedUser, updateCourse);

/**
 * route to update assign course
 * PUT /course/userCourse/:courseId/:userId/:action
 */
courseRoutes.put('/userCourse/:courseId/:userId/:action', isAuthorizedUser, userCourse);

/**
 * route to delete existing course
 * DELETE /course/new
 */
courseRoutes.delete('/:id', isAuthorizedUser, removeCourse);

/**
 * route to set course image
 * POST /course/courseImage
 */
courseRoutes.post('/courseImage/:id', isAuthorizedUser, avatarUpload, setCourseImage);

export default courseRoutes;
