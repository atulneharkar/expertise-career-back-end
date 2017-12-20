import fs from 'fs';
import path from 'path';

import ContactUs from '../models/contact-us';
import config from '../config/config';
import redisClient from '../config/redis';

/**
 * controller for add user query
 * POST /query/create
 */
export const addUserQuery = (req, res) => {
  var query = new ContactUs({
    'name': req.body.name,
    'email': req.body.email,
    'phone': req.body.phone,
    'description': req.body.description
  }); 

  query.save().then(() => {
    res.send(query);
  }).catch((e) => {
    res.status(400).send(e);
  });
};

/**
 * controller to get all/specific query
 * GET /course/
 * search all/id
 */
export const getAllUserQueries = (req, res) => {
  const search = {};

  if(req.params.search && req.params.search !== 'all') {
    search._id = req.params.search;
  }

  ContactUs.find(search)
  .then(queries => {
    res.status(200).send(queries);
  })
  .catch(err => {
    res.status(400).send(err);
  });
};