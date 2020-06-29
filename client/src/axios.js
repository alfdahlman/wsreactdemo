import axios from 'axios';

const instance = process.env.NODE_ENV === 'development'
? axios.create({
  headers: {
    post: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  baseURL: 'http://127.0.0.1:4001/'
})
: axios.create({
  headers: {
    post: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  baseURL: '/'
});

export default instance;
