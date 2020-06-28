import axios from 'axios';

const instance = axios.create({
  headers: {
    post: { 
      'Access-Control-Allow-Origin': '*'
    }
  },
  baseURL: 'http://127.0.0.1:4001/'
});

export default instance;
