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
    'description': req.body.description,
    'createdDate': new Date()
  }); 

  query.save().then(() => {
    res.send(query);
  }).catch((e) => {
    res.status(400).send(e);
  });
};

/**
 * controller to update existing query
 * PUT /query/:id
 */
export const updateQuery = (req, res) => {
  ContactUs.findByIdAndUpdate(req.params.id, {
    '$set': req.body
  }, {
    'new': true,
    'runValidators': true,
    'context': 'query'
  })
  .then(updatedQuery => {
    res.status(200).send(updatedQuery);
  })
  .catch(err => {
    res.status(400).send(err);
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