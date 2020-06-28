import fs from 'file-system';
import { submissionComplete } from '../utils/utils';

const userPath = './db/users.json';

export const users = (req, res) => {
  const obj = JSON.parse(fs.readFileSync(userPath));
  const users = {};

  Object.entries(obj)
    .filter(user => user[1].online === 'online')
    .map(user => {
      const { name, online } = user[1];
      users[user[0]] = { name, online }
    });
  return submissionComplete(res, 200, users);
};

export const userById = (req, res) => {
  const obj = JSON.parse(fs.readFileSync(userPath));
  if(!obj[req.params.id]){
    return submissionComplete(res, 422, 'user not found');
  }
  const { name, online } = obj[req.params.id];
  return submissionComplete(res, 200, {[req.params.id]: { name, online }});
};

export const userOnline = (req, res) => {
  const obj = JSON.parse(fs.readFileSync(userPath));
  console.log({...obj[req.params.id], online: 'online'});
  const user = {...obj[req.params.id], online: 'online'};
  obj[req.params.id] = user;
  fs.writeFileSync(userPath, JSON.stringify(obj), 'utf8', submissionComplete(res, 200, 'User online'));
};

export const userOffline = (req, res) => {
  const obj = JSON.parse(fs.readFileSync(userPath));
  console.log({...obj[req.params.id], online: 'offline'}, 'req.params.id', req.params.id);
  const user = {...obj[req.params.id], online: 'offline'};
  obj[req.params.id] = user;
  fs.writeFileSync(userPath, JSON.stringify(obj), 'utf8', submissionComplete(res, 200, 'User offline'));
};
