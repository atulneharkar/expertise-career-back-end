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
  'courseCategory': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter courseCategory'],
  },
  'courseDate': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter courseDate'],
  },
  'slot': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter slot'],
  },
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
  'author': {
    'type': mongoose.Schema.Types.ObjectId,
    'ref': 'User'
  },
  'courseImage': {}
});

const Course = mongoose.model('Course', courseSchema);

export default Course;