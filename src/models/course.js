import mongoose from 'mongoose';
import _ from 'lodash';
import otpGenerator from 'otp-generator';

import config from '../config/config';
import redisClient from '../config/redis';

const courseSchema = new mongoose.Schema({
  'title': {
    'type': String,
    'trim': true,
    // 'required': [true, 'Please enter title'],
  },
  'description': {
    'type': String,
    'trim': true,
    // 'required': [true, 'Please enter description'],
  },
  'courseType': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter courseType'],
  },
  'domain': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter courseType'],
  },
  'date': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter date'],
  },
  'slot': [{
    'fromTime': {
      'type': String,
      'trim': true,
      //'required': [true, 'Please enter from time'],
    },
    'toTime': {
      'type': String,
      'trim': true,
      //'required': [true, 'Please enter to time'],
    }
  }],
  'webinarLink': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter webinarLink'],
  },
  'courseContentLink': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter courseContentLink']
  },
  'registeredUsers': [{
    'user': {
      'type': mongoose.Schema.Types.ObjectId,
      'ref': 'User'
    }
  }],
  'authorName': {
    'type': mongoose.Schema.Types.ObjectId,
    'ref': 'User'
  },
  'courseImage': {}
});

const Course = mongoose.model('Course', courseSchema);

export default Course;