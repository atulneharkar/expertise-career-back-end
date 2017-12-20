import fs from 'fs';
import path from 'path';

import Course from '../models/course';
import config from '../config/config';
import redisClient from '../config/redis';

/**
 * controller for create course
 * POST /course/create
 */
export const createCourse = (req, res) => {
  var course = new Course({
    'title': req.body.title,
    'description': req.body.description,
    'courseType': req.body.courseType,
    'domain': req.body.domain,
    'date': req.body.date,
    'slot': req.body.slot,
    'webinarLink': req.body.webinarLink,
    'courseContentLink': req.body.courseContentLink,
    'RegisteredUsers': req.body.RegisteredUsers,
  }); 

  course.save()
  .then(savedCourse => {
    return Course.findById(savedCourse._id).populate('registeredUsers.user', USER_FIELDS_TO_POPULATE);
  })
  .then(savedCourse => {
    res.status(200).send(savedCourse);
  })
  .catch(err => {
    res.status(403).send(err);
  });
};

/**
 * controller to get all/specific course
 * GET /course/
 * search all/id
 */
export const getCourseList = (req, res) => {
  const search = {};

  if(req.params.search && req.params.search !== 'all') {
    search._id = req.params.search;
  }

  Course.find(search)
  .populate('registeredUsers.user', USER_FIELDS_TO_POPULATE)
  .populate('authorName', USER_FIELDS_TO_POPULATE)
  .then(courses => {
    res.status(200).send(courses);
  })
  .catch(err => {
    res.status(400).send(err);
  });
};

/**
 * controller to update existing course
 * PUT /course/:id
 */
export const updateCourse = (req, res) => {
  Course.findByIdAndUpdate(req.params.id, {
    '$set': req.body
  }, {
    'new': true,
    'runValidators': true,
    'context': 'query'
  })
  .populate('registeredUsers.user', USER_FIELDS_TO_POPULATE)
  .populate('authorName', USER_FIELDS_TO_POPULATE)
  .then(updatedCourse => {
    res.status(200).send(updatedCourse);
  })
  .catch(err => {
    res.status(400).send(err);
  });
};

/**
 * controller to delete existing course
 * DELETE /course/:id
 */
export const removeCourse = (req, res) => {
  Course.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(200).send();
  })
  .catch(err => {
    res.status(400).send(err);
  });
};

/**
 * controller to set course avatar/profile pic
 * once image store successfully then delete previous avatar
 * POST /course/avatar
 */
export const setCourseImage = (req, res) => {
  const oldImagePath = req.course.courseImage;

  Course.findByIdAndUpdate(req.course._id, {
      '$set': {
        'courseImage': `${config.API_URL}/uploads/courseImage/${req.file.filename}`
      }
    }, {
      'new': true
    })
    .then(course => {

      /* check for old avatar */
      if(oldImagePath) {
        fs.unlink(path.join(__dirname, './../../', oldImagePath));
      }

      res.send(course);
    })
    .catch(err => {
      res.status(400).send('Unable to set profile pic, Please try again');
    });
};