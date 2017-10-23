const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const { ObjectID } = require('mongodb');
import express from 'express';

const { users, populateUsers } = require('./../seed/seed');

const app = express();

beforeEach(populateUsers);

describe('POST /user/login', () => {
	it('should login user and return auth token', (done) => {
		request(app)
		  .post('/user/login')
		  .send({
		  	email: users[1].email,
		  	password: users[1].password
		  })
		  .expect(200)
		  .expect((res) => {
		  	expect(res.headers['x-auth']).toExist();
		  })
		  .end((err, res) => {
		  	if(err) {
		  		return done(err);
		  	}

		  	User.findById(users[1]._id).then((user) => {
		  		expect(user.tokens[0]).toInclude({
		  			access: 'auth',
		  			token: res.headers['x-auth']
		  		});
		  	});
		  	done();
		  }).catch((e) => done(e));
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
		  	expect(res.headers['x-auth']).toNotExist();
		  })
		  .end((err, res) => {
		  	if(err) {
		  		return done(err);
		  	}

		  	User.findById(users[1]._id).then((user) => {
		  		expect(user.tokens.length).toBe(0);
		  	});
		  	done();
		  }).catch((e) => done(e));
	});
});

describe('DELETE /user/logout', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/user/logout')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
      	if(err) {
      		return done(err);
      	}

      	User.findById(users[0]._id).then((user) => {
      		expect(user.tokens.length).toBe(0);
      	});
      	done();
      }).catch((e) => done(e));
  });
});