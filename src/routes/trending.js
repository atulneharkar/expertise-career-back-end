import express from 'express';

/* all controllers */
import {
  createTrending,
  getTrendingList,
  updateTrending,
  setTrendingImage,
  removeTrending
} from '../controllers/trending';

/* pic upload */
import { avatarUpload } from '../helpers/upload';

const trendingRoutes = express.Router();

/**
 * route to create a new trending
 * POST /trending/create
 */
trendingRoutes.post('/create', createTrending);

/**
 * route to get list of trending
 * GET /trending/list/:status [ux, vd, fe, be]
 */
trendingRoutes.get('/list/:status', getTrendingList);

/**
 * route to update specific trending
 * PUT /trending/:id
 */
trendingRoutes.put('/:id', updateTrending);

/**
 * route to delete existing trending
 * DELETE /trending/new
 */
trendingRoutes.delete('/:id', setTrendingImage);

/**
 * route to set trending image
 * POST /trending/trendingImage
 */
trendingRoutes.post('/trendingImage', avatarUpload, removeTrending);

export default trendingRoutes;
