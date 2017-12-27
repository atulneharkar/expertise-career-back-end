import mongoose from 'mongoose';
import _ from 'lodash';
import otpGenerator from 'otp-generator';

import config from '../config/config';
import redisClient from '../config/redis';

const contactUsSchema = new mongoose.Schema({
  'name': {
    'type': String,
    'trim': true,
    // 'required': [true, 'Please enter title'],
  },
  'email': {
    'type': String,
    'trim': true,
    // 'required': [true, 'Please enter description'],
  },
  'phone': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter courseType'],
  },
  'description': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter date'],
  },
  'createdDate': {
    'type': Date
  },
  'queryStatus': {
    'type': String,
    'enum': {
      'values': ['resolved', 'open', 'inProgress']
    },
    'default': 'open'
  }
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

export default ContactUs;