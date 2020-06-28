import * as actionTypes from './actionTypes';
import axios from '../../axios';

const setUser = (token, user, exp) => {
  return { type: actionTypes.SET_USER, token, user, exp }
}

const userJoin = (user) => {
  return { type: actionTypes.ADD_USER, user }
}

const addUser = id => {
  return dispatch => {
    axios.get('/user/' + id.userId).then(response => {
      dispatch(userJoin(response.data));
    }).catch(err => console.log(err));
  }
}

export const setSocket = (socket) => {
  return { type: actionTypes.SET_SOCKET, socket }
}

const userRemoved = (id) => {
  return { type: actionTypes.REMOVE_USER, id }
}

export const removeUser = (id) => {
  return dispatch => {
    axios.get('/useroffline/' + id.userId).then(response => {
      dispatch(userRemoved(id.userId));
    }).catch(err => console.log(err));
  }
}

const storeUsers = (data) => {
  return { type: actionTypes.STORE_USERS, data }
}

export const newMsg = (data) => {
  return { type: actionTypes.NEW_MSG, data }
}

export const authenticated = (token, user, exp, socket) => {

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('exp', exp);

  return dispatch => {
    dispatch(setUser(token, user, exp));
    socket.on("new_msg", data => {
      dispatch(newMsg(data));
    });
    socket.on('emitOn', id => dispatch(addUser(id)));
    socket.on('emitOff', id => dispatch(removeUser(id)));
  }
}

export const getUsers = (token) => {
  return dispatch => {
    axios.get('/users', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(response => {
      dispatch(storeUsers(response.data));
    }).catch(err => console.log(err));
  }
}

export const setRecipient = (recipient, socket) => {
  return { type: actionTypes.SET_RECIPIENT, recipient}
}

export const unsetRecipient = (recipient, socket) => {
  return { type: actionTypes.UNSET_RECIPIENT }
}

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('exp');

  return {
    type: actionTypes.LOGOUT_USER
  }
}
