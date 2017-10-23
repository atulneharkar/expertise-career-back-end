import express from 'express';

/* all routes */
import authenticationRoutes from './authenticate';
import userRoutes from './user';
import socialRoutes from './social-login';

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
 * all social login routes
 * GET /user/auth/google
 * GET /user/auth/facebook
 * GET /user/auth/twitter
 */
routes.use('/user', socialRoutes);

/**
 * all user routes
 * POST /user/create
 * PUT /user/update/:id
 */
routes.use('/user', userRoutes);

/**
 * all common routes goes here
 * GET /upload/:type/:file
 */
routes.use(commonRoutes);

export default routes;