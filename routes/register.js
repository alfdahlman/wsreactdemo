import express from 'express';
import bcrypt from 'bcrypt';
import fs from 'file-system';
import _id from 'uuid/v1';
import { submissionComplete } from '../utils/utils';

const userPath = './db/users.json';

export const register = (req, res) => {

  const obj = JSON.parse(fs.readFileSync(userPath));
  const { email, name, password } = req.body;

  if( !email || !name || !password ){
    return submissionComplete(res, 422, 'Data missing')
  }

  const userExists = Object.entries(obj)
    .filter(user => user[1].email === email);

  if( userExists.length ){
    return submissionComplete(res, 422, 'User exists')
  }

  bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
      console.log(err);
      return submissionComplete(res, 500, err);
    }
    obj[_id()] = { email, name, password: hash, online: 'offline' };
    fs.writeFileSync(userPath, JSON.stringify(obj), 'utf8', submissionComplete(res, 200, 'User added'))
  })

};
