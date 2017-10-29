const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const { ObjectID } = require('mongodb');
import jwt from 'jsonwebtoken';
import express from 'express';

import User from './../../src/models/user';
const { users, populateUsers } = require('./../seed/seed');

const app = require('./../../src');

beforeEach(populateUsers);

describe('GET /users/me', () => {
	it('should return a user if authenticated', (done) => {
		request(app)
		  .get('/user/me')
		  .set('x-auth', users[0].tokens[0].token)
		  .expect(200)
		  .expect((res) => {
		  	expect(res.body._id).to.equal(users[0]._id.toHexString());
		  	expect(res.body.email).to.equal(users[0].email);
		  })
		  .end(done);
	});

	it('should return a 401 if not authenticated', (done) => {
		request(app)
		  .get('/user/me')
		  .expect(401)
		  .expect((res) => {
		  	expect(res.body).to.equal({});
		  })
		  .end(done);
	});
});

const dummyUserId = new ObjectID();

describe('POST /user', () => {
	const dummyUser = {
	  name: 'Atul1',
		email: 'atul1@xyz.com',
		password: 'abc',
	  phone: '1234567897',
	  designation: 'Consultant',
	  role: 'admin',
	  avatar: 'abc123',
	  status: 'active',
	  dob: '12/2/2017',
	  doj: '12/2/2017',
		tokens: [{
			access: 'auth',
			token: jwt.sign({ _id: dummyUserId, access: 'auth'}, 'abc123').toString()
		}]
	};

	it('should create a user', (done) => {
		request(app)
			.post('/user/create')
			.send(dummyUser)
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
		  	expect(res.body._id).toExist();
		  	expect(res.body.email).to.equal(user.email);
		  })
		  .end((err, res) => {
  	  	if(err) {
  	  		return done(err);
  	  	}

  	  	const email = dummyUser.email;
  	  	User.findOne({email}).then((userObj) => {
  	  		expect(userObj).toExist();
  	  		expect(userObj.password).not.to.equal(dummyUser.password);
  	  		done();
  	  	}).catch((e) => done(e));
  	  });
	});

	it('should return validation errors if request invalid', (done) => {
    request(app)
			.post('/user/create')
			.send({})
			.expect(400)
			.end(done);
	});

	it('should not create user if email and phone no in use', (done) => {
		request(app)
			.post('/user/create')
			.send(dummyUser)
			.expect(400)
			.end(done);
	});
});

describe('GET /user/:id', () => {
  it('should return user if found in database', (done) => {

  });

  it('should return 404 error if user not found', (done) => {
  	
  });

  it('should return 400 error if userId is empty', (done) => {
  	
  });
});

describe('GET /user/list', () => {
	it('should return list of all users', (done) => {

	});
});

describe('PUT /user/:id', () => {
	it('should create a user', (done) => {

	});

	it('should return validation errors if request invalid', (done) => {

	});

	it('should not update user if email and phone no in use by other users', (done) => {

	});
});

describe('POST /user/avatar', () => {
	it('should set avatar url in database and add new avatar file in /uploads/avatar folder and unlink the old file', (done) => {

	});

	it('should send 400 error if avatar is not set properly', (done) => {

	});
});