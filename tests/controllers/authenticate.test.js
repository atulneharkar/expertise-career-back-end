const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const { ObjectID } = require('mongodb');
import express from 'express';
import jwt from 'jsonwebtoken';

import User from './../../src/models/user';
const { users, populateUsers } = require('./../seed/seed');
import redisClient from './../../src/config/redis';
import config from './../../src/config/config';

const app = require('./../../src');

beforeEach(populateUsers);

describe('POST /user/login', () => {
	it('should login user and return auth token', (done) => {
		request(app)
		  .post('/user/login')
		  .send({
		  	email: users[0].email,
		  	password: users[0].password
		  })
		  .expect(200)
		  .expect((res) => {
		  	expect(res.headers['x-auth']).to.exist;
		  })
		  .expect((res) => {
		  	expect(res.headers['x-auth']).to.exist;
		  })
		  .end((err, res) => {
		  	if(err) {
		  		return done(err);
		  	}

		  	let decode = null;
		  	try {
			    decode = jwt.verify(res.headers['x-auth'], config.AUTH_KEY);
			  } catch (err) {
			    done(err);
			  }
		  	redisClient.sismember(`auth:${decode._id}`, res.headers['x-auth'], (err, data) => {
		      if(err) {
		        done(err);
		      }

		      expect(data).to.equal(1);
		      done();
		    });
		  });
	});

	it('should reject invalid login', (done) => {
		request(app)
		  .post('/user/login')
		  .send({
		  	email: users[1].email,
		  	password: users[1].password + '1'
		  })
		  .expect(400)
		  .expect((res) => {
		  	expect(res.headers['x-auth']).to.not.exist;
		  })
		  .end((err, res) => {
		  	if(err) {
		  		return done(err);
		  	}

		  	User.findById(users[1]._id).then((user) => {
		  		expect(user.tokens.length).to.equal(0);
		  	});
		  	done();
		  });
	});
});

describe('DELETE /user/logout', () => {
  it.only('should remove auth token from redis on logout', (done) => {
    request(app)
      .delete('/user/logout')
      .set('x-auth', users[0].tokens[0].token)
      .end((err, res) => {
      	if(err) {
      		return done(err);
      	}

      	let decode = null;
		  	try {
			    decode = jwt.verify(users[0].tokens[0].token, config.AUTH_KEY);
			  } catch (err) {
			    done(err);
			  }
		  	redisClient.sismember(`auth:${decode._id}`, users[0].tokens[0].token, (err, data) => {
		      if(err) {
		        done(err);
		      }

		      expect(data).to.equal(1);
		      done();
		    });
      });
  });

  it('should reject logout request if token not present', (done) => {
  	// request(app)
  	//   .delete('/user/logout')
  });
});

describe('POST /forgot-password', () => {
	it('should send otp and userID if email id is present in database', (done) => {

	});

	it('should send 404 error if email id is not present in database', (done) => {

	});
});

describe('POST /reset-password', () => {
	it('should reset password successfully if userId, otp and password is present', (done) => {

	});

	it('should send 404 error if userId is not found', (done) => {

	});

	it('should send 400 error if userId, otp or password is empty', (done) => {

	});
});


