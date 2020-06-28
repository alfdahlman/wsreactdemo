import express from 'express';
import bcrypt from 'bcrypt';
import fs from 'file-system';
import jwt from 'jsonwebtoken';
import * as keys from '../config/keys';
import { submissionComplete } from '../utils/utils';

const userPath = './db/users.json';

export const login = (req, res) => {

  const obj = JSON.parse(fs.readFileSync(userPath));
  const { email, password } = req.body;

  if( !email || !password ){
    return submissionComplete(res, 422, 'Data missing')
  }

  const savedUser = Object.entries(obj)
    .filter((user) => {
      return user[1].email === email
    });

  if( !savedUser.length ){
    return submissionComplete(res, 422, 'Invalid')
  }

  bcrypt.compare(password, savedUser[0][1].password)
  .then(match => {
    if(match){
      const exp = Math.floor(Date.now() / 1000) + (60 * 60);
      const token = jwt.sign({
         exp: exp,
         _id: savedUser[0][0] },
         keys.JWT_SECRET);
      const {name, email} = savedUser[0][1];
      const payload = {
        message: "success",
        user: {
          _id: savedUser[0][0],
          name,
          email,
          online: true
        },
        token,
        exp
      }

      return submissionComplete(res, 200, payload)
    }else{
      return submissionComplete(res, 422, 'Invalid')
    }
  })
  .catch(err => console.log(err));
};
