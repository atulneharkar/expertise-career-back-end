import express from 'express';

/* all routes */
import authenticationRoutes from './authenticate';
import userRoutes from './user';
import courseRoutes from './course';
import queryRoutes from './contact-us';
import trendingRoutes from './trending';

/* all common routes goes here */
import commonRoutes from './common';

/* all middlewares */
import { isAuthorizedUser } from '../middlewares/authenticate';

const routes = express.Router();

/**
 * all authentication routes
 * POST /user/login
 * DELETE /user/logout
 */
routes.use('/user', authenticationRoutes);

/**
 * all user routes
 * POST /user/create
 * PUT /user/update/:id
 */
routes.use('/user', isAuthorizedUser, userRoutes);

/**
 * all course routes
 * POST /course/create
 * PUT /course/update/:id
 */
routes.use('/course', isAuthorizedUser, courseRoutes);

/**
 * all user queries routes
 * POST /queries/add
 * GET /queries/getall
 */
routes.use('/query', queryRoutes);

/**
 * all user trending routes
 * POST /trending/add
 * PUT /trending/update/:id
 */
routes.use('/trending', isAuthorizedUser, trendingRoutes);

/**
 * all common routes goes here
 * GET /upload/:type/:file
 */
routes.use(commonRoutes);

export default routes;