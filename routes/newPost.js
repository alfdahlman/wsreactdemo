import express from 'express';
import fs from 'file-system';
import _id from 'uuid/v1';
import { submissionComplete } from '../utils/utils';

const postPath = './db/posts.json';

export const newPost = (req, res) => {

  const obj = JSON.parse(fs.readFileSync(postPath));
  const { title, description, userId } = req.body;
  const key = _id();
  let img;

  if(req.files && req.files.file){
    img = req.files.file;
  }

  if( !title || !userId ) return submissionComplete(res, 422, 'Data missing');

  obj[key] = { title, description, userId };

  if(img){
    img.mv('./db/uploads/' + key + '_' + img.name, (err) => {
      if (err) console.log(err);
      obj[key].image = '/uploads/' + key + '_' + img.name;
    });
  }

  fs.writeFileSync(postPath, JSON.stringify(obj), 'utf8', submissionComplete(res, 200, 'Post added'));
}
