import ContactUs from '../models/contact-us';
import config from '../config/config';
import redisClient from '../config/redis';
import smtpTransport from '../config/smtp.config';
import { userQueryTemplate, adminQueryTemplate } from '../helpers/emailTemplate';

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
    const userMailOptions = {
      to : req.body.email,
      subject : "Skillunfold.com - Query recieved, admin will contact you shortly",
      text : queryTemplate
    }

    smtpTransport.sendMail(userMailOptions, function(error, response) {
      if(error) {
        console.log(error);
      } else {
        console.log("Message sent: " + response.message);
      }
    });

    const adminMailOptions = {
      to : 'info.skillunfold@gmail.com',
      subject : "Skillunfold.com - New user query submitted",
      text : adminQueryTemplate(req.body.name, req.body.email, req.body.phone, req.body.description)
    }

    smtpTransport.sendMail(adminQueryTemplate, function(error, response) {
      if(error) {
        console.log(error);
      } else {
        console.log("Message sent: " + response.message);
      }
    });

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