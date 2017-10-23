import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';

import User from './../../src/models/user';
import dbConnection from './../../src/db/mongoose';

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
  name: 'Atul',
	email: 'atul@gmail.com',
	password: 'abc',
  phone: '8767067878',
  designation: 'Consultant',
  role: 'admin',
  avatar: 'abc123',
  status: 'active',
  dob: '12/2/2017',
  doj: '12/2/2017',
	tokens: [{
		access: 'auth',
		token: jwt.sign({ _id: userOneId, access: 'auth'}, 'abc123').toString()
	}]
}, 
{
  _id: userTwoId,
  name: 'Manish',
  email: 'manish@gmail.com',
  password: 'abc',
  phone: '8424959895',
  designation: 'Consultant',
  role: 'user',
  avatar: 'abc123',
  status: 'inactive',
  dob: '12/2/2017',
  doj: '12/2/2017',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userTwoId, access: 'auth'}, 'abc123').toString()
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    return User.insertMany(users);
  })
  // .then(() => {
  //   const userOne = new User(users[0]).save();
  //   const userTwo = new User(users[1]).save();

  //   return Promise.all([userOne, userTwo]);
  // })
  .then(() => done())
  .catch(err => {console.log(err);done(err);});
};

module.exports = { users, populateUsers }; 