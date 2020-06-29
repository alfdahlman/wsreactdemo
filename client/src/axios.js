import axios from 'axios';

const instance = process.env.NODE_ENV === 'development'
? axios.create({
  headers: {
    post: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  baseURL: 'http://192.168.0.35:4001/'
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
