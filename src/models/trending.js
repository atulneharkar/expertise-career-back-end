import mongoose from 'mongoose';
import _ from 'lodash';
import otpGenerator from 'otp-generator';

import config from '../config/config';
import redisClient from '../config/redis';

const trendingSchema = new mongoose.Schema({
  'title': {
    'type': String,
    'trim': true,
    // 'required': [true, 'Please enter title'],
  },
  'videoLink': {
    'type': String,
    'trim': true,
    // 'required': [true, 'Please enter description'],
  },
  'trendingCategory': {
    'type': String,
    'trim': true,
    // 'required': [true, 'Please enter description'],
  },
  'trendingImage': {}
});

const Trending = mongoose.model('Trending', trendingSchema);

export default Trending;