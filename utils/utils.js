import fs from 'file-system';
const userPath = './db/users.json';

const statusUpdated = () => console.log('[status updated]');

export const updateUserStatus = (id, status) => {
  const obj = JSON.parse(fs.readFileSync(userPath));
  const user = {...obj[id], online: status};
  obj[id] = user;
  console.log('updateUserStatus', obj);

  fs.writeFileSync(userPath, JSON.stringify(obj), 'utf8', statusUpdated());
};

export const submissionComplete = (res, status, message) => {
  res.status(status).json(message);
}
