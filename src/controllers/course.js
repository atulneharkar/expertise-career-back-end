import Course from '../models/course';
import User from '../models/user';
import config from '../config/config';
import redisClient from '../config/redis';

export const USER_FIELDS_TO_POPULATE = '_id name email';

/**
 * controller for create course
 * POST /course/create
 */
export const createCourse = (req, res) => {
  var course = new Course({
    'title': req.body.title,
    'description': req.body.description,
    'courseType': req.body.courseType,
    'courseCategory': req.body.courseCategory,
    'courseDate': req.body.courseDate,
    'slot': req.body.slot,
    'webinarLink': req.body.webinarLink,
    'coursePrice': req.body.coursePrice,
    'author': req.body.author
  }); 

  course.save()
  .then(savedCourse => {
    return Course.findById(savedCourse._id)
      .populate('registeredUsers.user', USER_FIELDS_TO_POPULATE)
      .populate('author', USER_FIELDS_TO_POPULATE);
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
  .populate('registeredUsers', USER_FIELDS_TO_POPULATE)
  .populate('author', USER_FIELDS_TO_POPULATE)
  .then(courses => {
    res.status(200).send(courses);
  })
  .catch(err => {
    res.status(400).send(err);
  });
};

/**
 * controller to get all/specific course
 * GET /course/
 * search all/id
 */
export const getMyCourseList = (req, res) => {
  const userId = req.params.userId;
console.log(userId);
  Course.find({ 'registeredUsers': userId })
  .then(courses => {
    res.status(200).send(courses);
  })
  .catch(err => {
    res.status(400).send(err);
  });
};

/**
 * controller to get specific course info
 * GET /course/:id
 */
export const getCourseByID = (req, res) => {
  Course.findById(req.params.id)
    .populate('registeredUsers.user', USER_FIELDS_TO_POPULATE)
    .populate('author', USER_FIELDS_TO_POPULATE)
    .then(course => {
      if(!course) {
        return Promise.reject({'status': 404});
      }

      res.status(200).send(course);
    })
    .catch(err => {
      res.status(err.status || 400).send();
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
  .populate('author', USER_FIELDS_TO_POPULATE)
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
  .then((course) => {
    res.status(200).send(course);
  })
  .catch(err => {
    res.status(400).send(err);
  });
};

/**
 * controller to assign course to users
 * PUT /course/userCourse/:courseId/:userId/:action
 */
export const userCourse = (req, res) => {
  let courseId = req.params.courseId;
  let userId = req.params.userId;
  let action = req.params.action;
  let registeredUsers = [];

  Course.findById(courseId)
    .then(course => {
      if(!course) {
        return Promise.reject({'status': 404});
      }

      if(course.registeredUsers.length > 0) {
        registeredUsers = course.registeredUsers;
        if(registeredUsers.indexOf(userId) == -1) {
          if(action === 'add') {
            registeredUsers.push(userId);
          }
        } else {
          if(action === 'remove') {
            registeredUsers.splice((registeredUsers.indexOf(userId)), 1);
          }
        }
      } else {
        if(action === 'add') {
          registeredUsers.push(userId);
        }
      }

      Course.findByIdAndUpdate(courseId, {
        '$set': { registeredUsers }
      }, {
        'new': true,
        'runValidators': true,
        'context': 'query'
      })
      .then(updatedCourse => {
        res.status(200).send(updatedCourse);
      })
    })
    .catch(err => {
      res.status(err.status || 400).send();
    });
};

/**
 * controller to set course avatar/profile pic
 * once image store successfully then delete previous avatar
 * POST /course/avatar
 */
export const setCourseImage = (req, res) => {
  let oldImagePath = null;
  
  Course.find({ _id: req.params.id })
  .then(course => {
    oldImagePath = course.avatar;
  })

  Course.findByIdAndUpdate(req.params.id, {
      '$set': {
        'courseImage': `https://skillunfold.com/api/uploads/avatar/${req.file.filename}`
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