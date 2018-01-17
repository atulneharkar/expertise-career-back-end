import express from 'express';

/* all controllers */
import {
  createTrending,
  getTrendingList,
  updateTrending,
  setTrendingImage,
  removeTrending,
  getTrendingByID
} from '../controllers/trending';

import { isAuthorizedUser } from '../middlewares/authenticate';

/* pic upload */
import { avatarUpload } from '../helpers/upload';

const trendingRoutes = express.Router();

/**
 * route to create a new trending
 * POST /trending/create
 */
trendingRoutes.post('/create', isAuthorizedUser, createTrending);

/**
 * route to get list of trending
 * GET /trending/list/:category [ux, vd, fe, be]
 */
trendingRoutes.get('/list/:category', getTrendingList);

/**
 * route to get specific trending's info
 * GET /trending/:id
 */
trendingRoutes.get('/:id', isAuthorizedUser, getTrendingByID);

/**
 * route to update specific trending
 * PUT /trending/:id
 */
trendingRoutes.put('/:id', isAuthorizedUser, updateTrending);

/**
 * route to delete existing trending
 * DELETE /trending/new
 */
trendingRoutes.delete('/:id', isAuthorizedUser, removeTrending);

/**
 * route to set trending image
 * POST /trending/trendingImage
 */
trendingRoutes.post('/trendingImage/:id', isAuthorizedUser, avatarUpload, setTrendingImage);

export default trendingRoutes;
