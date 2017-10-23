import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';
import _ from 'lodash';
import moment from 'moment';
import otpGenerator from 'otp-generator';
import config from '../config/config';

import {
  hashData
} from '../helpers/encryption';

import {
  isValidName,
  isValidEmail,
  isValidPhoneNumber
} from '../helpers/validation';

const userSchema = new mongoose.Schema({
  'name': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter your name'],
    'validate': {
      'isAsync': false,
      'validator': isValidName,
      'message': 'Please enter a valid name'
    }
  },
  'phone': {
    'type': String,
    'trim': true,
    'unique': [true, 'Phone number has already been used'],
    //'required': [true, 'Please enter your phone number'],
    'validate': {
      'isAsync': false,
      'validator': isValidPhoneNumber,
      'message': 'Please enter a valid phone number'
    }
  },
  'email': {
    'type': String,
    'trim': true,
    'unique': [true, 'Email ID has already been used'],
    //'required': [true, 'Please enter your email ID'],
    'validate': {
      'isAsync': false,
      'validator': isValidEmail,
      'message': 'Please enter a valid email'
    }
  },
  'password': {
    'type': String,
    //'required': [true, 'Please enter your password']
  },
  'designation': {
    'type': String,
    'trim': true,
    //'required': [true, 'Please enter your designation']
  },
  'avatar': {
    'type': String
  },
  'role': {
    'type': String,
    'trim': true,
    'enum': {
      'values': ['admin', 'photographer', 'user'],
      'message': 'Please enter a valid user role'
    },
    //'required': [true, 'Please enter your role'],
    'default': 'user'
  },
  'status': {
    'type': String,
    'enum': {
      'values': ['active', 'inactive', 'pending']
    },
    'default': 'pending'
  },
  'dob': {
    'type': Date,
    //'required': [true, 'Please enter date of birth']
  },
  'otp': {
    'type': String,
    'trim': true,
    'default': ''
  },
  'otpExpire': {
    'type': Date
  },
  'tokens': [{
    'access': {
      'type': String,
      'required': true
    },
    'token': {
      'type': String,
      'required': true
    }
  }],
  'google': {
    'id': String,
    'name': String,
    'email': String
  },
  'facebook': {
    'id': String,
    'name': String,
    'email': String
  },
  'twitter': {
    'id': String,
    'userName': String,
    'name': String
  },
  'linkedin': {
    'id': String,
    'name': String,
    'email': String
  },
  'github': {
    'id': String,
    'name': String,
    'email': String
  }
});

/**
 * instance method (built-in) to skip some data from being send to user
 */
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  const skipFields = ['password', '__v', 'tokens'];

  return _.omit(userObject, skipFields);
};

/**
 * instance method to generate auth token for user
 * token gets generate after login/registration
 * function - required 'this'
 */
userSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({ _id: user._id.toHexString(), access}, config.AUTH_KEY).toString();

  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token;
  });
};

/**
 * model funtion to remove users token
 * function - required 'this'
 * @param {String} token [user token]
 */
userSchema.methods.removeToken = function(token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: { token }
    }
  });
};

/**
 * instance method to generate otp
 * token has expiration in hours
 * function - required 'this'
 */
userSchema.methods.generateOTP = function() {
  const user = this;

  const otp = otpGenerator.generate(8, {
    'upperCase': false,
    'specialChars': false
  });

  user.otp = otp;
  user.otpExpire = moment().add(config.OTP_EXPIRY_TIME, 'h').toDate();

  return user.save();
};

/**
 * instance method to verify otp and its expiry
 * if otp is valid then reset the password
 * function - required 'this'
 */
userSchema.methods.verifyOTPAndResetPassword = function(providedOTP, newPassword) {
  const user = this;

  /* compare otp and verify otp expiry */
  if(user.otp && user.otp === providedOTP && moment().diff(moment(user.otpExpire)) < 0) {
    user.otp = '';
    user.otpExpire = moment().subtract(config.OTP_EXPIRY_TIME, 'h').toDate();
    user.password = newPassword;

    return user.save();
  } else {
    return Promise.reject({'status': 400});
  }
};

/**
 * model function to find user by auth token
 * useful for login check
 * function - required 'this'
 * @param {String} teken [user token]
 */
userSchema.statics.findUserByToken = function(token) {
  const user = this;
  var decode = null;

  if(!token) {
    return Promise.reject({'status': 401});
  }

  try {
    decode = jwt.verify(token, config.AUTH_KEY);
  } catch (e) {
    return Promise.reject({'status': 401});
  }

  return user.findOne({'_id': decode._id});
};

/**
 * model funtion to find user by using email and password
 * function - required 'this'
 * @param {String} email [user email]
 * @param {String} password [user password]
 */
userSchema.statics.findUserByCredentials = function(email, password) { 
  const User = this;

  return User.findOne({ email }).then((user) => {
    if(!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        (res) ? resolve(user) : reject();
      });
    });
  });
};

/**
 * encypt the password if its changed
 * function - required 'this'
 */
userSchema.pre('save', function(next) {
  const user = this;

  if(user.isModified('password')) {

    hashData(user.password)
      .then(hashedPassword => {
        user.password = hashedPassword;

        next();
      });

  } else {
    next();
  }
});

/**
 * since mogoose does not provide custom error message for unique fields
 * {PATH} {VALUE} {TYPE}
 */
userSchema.plugin(uniqueValidator, { 'message': '{PATH}' });

const User = mongoose.model('User', userSchema);

export default User;