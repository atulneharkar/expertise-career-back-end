import express from 'express';

/* all controllers */
import {
  createUser,
  getUser,
  getUserByID,
  getUserList,
  updateUser,
  setAvatar
} from '../controllers/user';

/* pic upload */
import { avatarUpload } from '../helpers/upload';

/* all middleware */
import { isAuthorizedUser, verifyAgainstDB } from '../middlewares/authenticate';

const userRoutes = express.Router();

/**
 * route to create a new user
 * POST /user/create
 */
userRoutes.post('/create', createUser);

/**
 * route to get specific user's info
 * GET /user/:id
 */
userRoutes.get('/:id', isAuthorizedUser, getUserByID);

/**
 * route to get list of users
 * GET /user/list/:status [all, pending, active, inactive]
 */
userRoutes.get('/list/:status', isAuthorizedUser, getUserList);

/**
 * route to update specific user
 * PUT /user/:id
 */
userRoutes.put('/:id', isAuthorizedUser, updateUser);

/**
 * route to set user avatar
 * POST /user/avatar
 */
userRoutes.post('/avatar', isAuthorizedUser, avatarUpload, setAvatar);

export default userRoutes;