import * as actionTypes from './actions/actionTypes';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  token: null,
  user: null,
  recipient: null,
  socket: null,
  onlineUsers: {},
  messages: {}
}

const setUser = (state, action) => {
  state.socket.emit('join', {
    name: action.user.name,
    id: action.user._id
  });

  return {
    ...state,
    token: action.token,
    user: action.user
  };
}

const addUser = (state, action) => {
  const updatedUsers = {...state.onlineUsers, ...action.user}
  return {
    ...state,
    onlineUsers: updatedUsers
  };
}

const removeUser = (state, action) => {
  const onlineUsers = {...state.onlineUsers};
  delete onlineUsers[action.id];
  return {
    ...state,
    onlineUsers: onlineUsers
  };
}

const newMsg = (state, action) => {
  const { msg, user, recipient } = action.data;
  const userId = state.user._id;
  const timestamp = Date.now();
  const newMessage = { timestamp, user, msg, id: uuidv4() };
  const updatedMessages = {...state.messages};
  const updatedUsers = {...state.onlineUsers};

  let thread = null;

  if(userId === user){
    thread = recipient;
  }else{
    thread = user;
    if(user !== state.recipient?.[0]){
      const currentUser = {...state.onlineUsers[user]};
      currentUser['unread'] ?
      currentUser['unread']++ :
      currentUser['unread'] = 1;

      updatedUsers[user] = currentUser;
    }
    console.log('[user]', updatedUsers);
  }

  state.messages[thread] ?
  updatedMessages[thread] = [...state.messages[thread], newMessage] :
  updatedMessages[thread] = [newMessage];

  return {
    ...state,
    messages: updatedMessages,
    onlineUsers: updatedUsers
  };
}

const logoutUser = (state, action) => {
  state.socket.emit('leaveChat', state.user._id);
  return {
    ...state,
    token: null,
    user: null,
    recipient: null,
  };
}

const storeUsers = (state, action) => {
  return {
    ...state,
    onlineUsers: action.data
  }
}

const unsetRecipient = (state, action) => {
  return {
    ...state,
    recipient: null
  }
}

const setRecipient = (state, action) => {
  const updatedUsers = {...state.onlineUsers};
  const currentUser = {...state.onlineUsers[action.recipient[0]]};

  currentUser['unread'] = false;
  updatedUsers[action.recipient[0]] = currentUser;

  console.log(currentUser);

  return {
    ...state,
    recipient: action.recipient,
    onlineUsers: updatedUsers
  }
}

const setSocket = (state, action) => {
  return {
    ...state,
    socket: action.socket
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type){
    case actionTypes.STORE_USERS: return storeUsers(state, action);
    case actionTypes.SET_USER: return setUser(state, action);
    case actionTypes.ADD_USER: return addUser(state, action);
    case actionTypes.REMOVE_USER: return removeUser(state, action);
    case actionTypes.NEW_MSG: return newMsg(state, action);
    case actionTypes.LOGOUT_USER: return logoutUser(state, action);
    case actionTypes.SET_RECIPIENT: return setRecipient(state, action);
    case actionTypes.UNSET_RECIPIENT: return unsetRecipient(state, action);
    case actionTypes.SET_SOCKET: return setSocket(state, action);
    default: return state;
  }
}

export default reducer;
