import express from 'express';

/* all controllers */
import {
  login,
  logout,
  sendOTPLink,
  resetPassword
} from '../controllers/authenticate';

/* all middleware */
import { isAuthorizedUser } from '../middlewares/authenticate';

const authenticationRoutes = express.Router();

/**
 * user login
 * POST /user/login
 */
authenticationRoutes.post('/login', login);

/**
 * user logout
 * DELETE /user/logout
 */
authenticationRoutes.delete('/logout', isAuthorizedUser, logout);

/**
 * route to send forgot password link
 * POST /forgot-password
 * required email
 */
authenticationRoutes.post('/forgot-password', sendOTPLink);

/**
 * route to reset the password
 * POST /reset-password
 * required otp, userID, password
 */
authenticationRoutes.post('/reset-password', resetPassword);

export default authenticationRoutes;