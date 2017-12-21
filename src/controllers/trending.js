import fs from 'fs';
import path from 'path';

import Trending from '../models/trending';
import config from '../config/config';
import redisClient from '../config/redis';

/**
 * controller for create trending
 * POST /trending/create
 */
export const createTrending = (req, res) => {
  var trending = new Trending({
    'title': req.body.title,
    'videoLink': req.body.videoLink,
    'trendingCategory': req.body.trendingCategory
  }); 

  trending.save().then(() => {
    res.send(trending);
  }).catch((e) => {
    res.status(400).send(e);
  });
};

/**
 * controller to get all/specific trending
 * GET /trending/
 * search all/id
 */
export const getTrendingList = (req, res) => {
  const search = {};

  if(req.params.search && req.params.search !== 'all') {
    search._id = req.params.search;
  }

  Trending.find(search)
  .then(trending => {
    res.status(200).send(trending);
  })
  .catch(err => {
    res.status(400).send(err);
  });
};

/**
 * controller to get specific trending info
 * GET /trending/:id
 */
export const getTrendingByID = (req, res) => {
  Trending.findById(req.params.id)
    .then(trending => {
      if(!trending) {
        return Promise.reject({'status': 404});
      }

      res.status(200).send(trending);
    })
    .catch(err => {
      res.status(err.status || 400).send();
    });
};

/**
 * controller to update existing trending
 * PUT /trending/:id
 */
export const updateTrending = (req, res) => {
  Trending.findByIdAndUpdate(req.params.id, {
    '$set': req.body
  }, {
    'new': true,
    'runValidators': true,
    'context': 'query'
  })
  .then(updatedTrending => {
    res.status(200).send(updatedTrending);
  })
  .catch(err => {
    res.status(400).send(err);
  });
};

/**
 * controller to delete existing trending
 * DELETE /trending/:id
 */
export const removeTrending = (req, res) => {
  Trending.findByIdAndRemove(req.params.id)
  .then((trending) => {
    res.status(200).send(trending);
  })
  .catch(err => {
    res.status(400).send(err);
  });
};

/**
 * controller to set trending avatar/profile pic
 * once image store successfully then delete previous avatar
 * POST /trending/avatar
 */
export const setTrendingImage = (req, res) => {
  let oldImagePath = null;
  
  Trending.find({ _id: req.params.id })
  .then(trending => {
    oldImagePath = trending.avatar;
  })

  Trending.findByIdAndUpdate(req.params.id, {
      '$set': {
        'trendingImage': `${config.API_URL}/uploads/avatar/${req.file.filename}`
      }
    }, {
      'new': true
    })
    .then(trending => {

      /* check for old avatar */
      if(oldImagePath) {
        fs.unlink(path.join(__dirname, './../../', oldImagePath));
      }

      res.send(trending);
    })
    .catch(err => {
      res.status(400).send('Unable to set profile pic, Please try again');
    });
};