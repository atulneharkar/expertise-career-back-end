import express from 'express';

/* all controllers */
import {
  addUserQuery,
	getAllUserQueries
} from '../controllers/contact-us';

/* all middlewares */
import { isAuthorizedUser } from '../middlewares/authenticate';

const queryRoutes = express.Router();

/**
 * user login
 * POST /user/login
 */
queryRoutes.post('/create', addUserQuery);

/**
 * route to get list of courses
 * GET /course/list/:status [all, pending, active, inactive]
 */
queryRoutes.get('/list/:status', isAuthorizedUser, getAllUserQueries);

export default queryRoutes;