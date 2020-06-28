import React, {Component} from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions/actions';
import socketIOClient from "socket.io-client";
import axios from './axios';

import './assets/style/style.css';

import Header from './containers/Header/Header';
import Auth from './containers/Auth/Auth';
import Chat from './containers/Chat/Chat';

class App extends Component {

  UNSAFE_componentWillMount(){
    const socket = socketIOClient('http://127.0.0.1:4001');
    this.props.onSetSocket(socket);

    const token = localStorage.getItem('token');

    if(token){
      const exp = localStorage.getItem('exp');
      if(exp > (new Date().getTime() / 1000)){
        const user = JSON.parse(localStorage.getItem('user'));
        this.props.onAuthenticated(token, user, exp, socket);

        axios.get('/useronline/' + user._id, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }).then(response => {
          console.log(response.data);
        }).catch(err => console.log(err));

        this.props.onGetUsers(token);
      }
    }

    window.addEventListener('beforeunload', () => this.logoutRequest(this.props.user?._id, this.props.token));
  }

  logoutRequest = (user, token) => {
    if(user && token){
      this.props.onRemoveUser(user, token);
    }
  }

  render(){
    return (
      <div className='App'>
        <Header />
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/" component={Chat} />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state  => {
  return {
    isAuthenticated: state.token !== null,
    user: state.user,
    token: state.token
  };
};

const mapDispatchToProps = dispatch => {
  return{
    onRemoveUser: (id, token) => dispatch(actions.removeUser({userId: id}, token)),
    onSetSocket: (socket) =>  dispatch(actions.setSocket(socket)),
    onAuthenticated: (token, user, exp, socket) => dispatch(actions.authenticated(token, user, exp, socket)),
    onGetUsers: (token) => dispatch(actions.getUsers(token)),
  };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
