import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/actions';
import ChatString from '../../components/Conversation/ChatString/ChatString';
import ChatSubmit from '../../components/Conversation/ChatSubmit/ChatSubmit';
import classes from './Chat.module.css';

class Chat extends Component {

  state = {
    currentMsg: {}
  }

  componentDidMount() {
    this.scrollToPosition();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages !== this.props.messages) {
      this.scrollToPosition();
    }
  }

  scrollToPosition = () => {
    if(this._chatWindow){
      this._chatWindow.scrollTop = this._chatWindow?.scrollHeight;
    }
  }

  startChatHandler = (msg, user, recipient) => {
    this._input.focus();

    const currentMsg = {...this.state.currentMsg};
    currentMsg[recipient] = '';
    this.setState({ currentMsg: currentMsg });

    this.props.socket.emit('chat', { msg, user, recipient });
    this.props.onNewMsg({ msg, user, recipient });
  }

  currentMsgHandler = (event, identifier) => {
    const currentMsg = {...this.state.currentMsg};
    currentMsg[identifier] = event.target.value;
    this.setState({ currentMsg: currentMsg });
  }

  render(){
    let authRedirect = null;
    if(!this.props.isAuthenticated){
      authRedirect = <Redirect to="/auth" />
    }

    let messages = this.props.messages?.[this.props.recipient?.[0]];
    if(messages){
      messages = messages
      .sort((a,b) => a.timestamp - b.timestamp )
      .map(msg => {
        let style = null;
        if(msg.user === this.props.user?._id){
          style = 'Right';
        }else{
          style = 'Left';
        }
        return <ChatString key={msg.id} stringStyle={style}>{msg.msg}</ChatString>;
      });
    }

    let chatWindow = null;
    if(this.props.recipient?.[0]){
      chatWindow = (
        <div>
          { messages }
          <div></div>
          <ChatSubmit
            send={ () => this.startChatHandler(
                this.state.currentMsg?.[this.props.recipient?.[0]],
                this.props.user._id, this.props.recipient?.[0] )}
            val={ this.state.currentMsg?.[this.props.recipient?.[0]] ?
              this.state.currentMsg?.[this.props.recipient?.[0]] :
              ''}
            change={(event) => this.currentMsgHandler(event, this.props.recipient?.[0])}
            ref={(input) => this._input = input}
            />
        </div>
      );
    }

    let userList = <li>No users currently online...</li>;
    if(Object.entries(this.props.onlineUsers).length > 1){
      userList = Object.entries(this.props.onlineUsers)
      .filter(user => user[0] !== this.props.user?._id)
      .map(user => {
        let style = null;
        if(user[0] === this.props.recipient?.[0]){
          style = {'fontWeight': 'bold'};
        }
        return (
          <li key={user[0]} style={style} onClick={() => this.props.onSetRecipient(user, this.props.socket)}>
            {user[1]['name']}
            {
              user[1]['unread'] ?
              <span className={classes.Unread}>{user[1]['unread']}</span>  :
              null
            }</li>
        );
      })
    }

    return (
      <div className={classes.Chat}>
      { authRedirect }
      { !this.props.recipient ?
        <div className={classes.UserList}>
          <ul>{ userList }</ul>
        </div> :
        <div
          className={classes.Main}
          ref={(chat) => this._chatWindow = chat}>
          { chatWindow }
        </div>
      }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
    token: state.token,
    socket: state.socket,
    user: state.user,
    onlineUsers: state.onlineUsers,
    recipient: state.recipient,
    messages: state.messages
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogoutUser: (id) => dispatch(actions.logoutUser(id)),
    onGetUsers: (token) => dispatch(actions.getUsers(token)),
    onSetRecipient: (recipient, socket) => dispatch(actions.setRecipient(recipient, socket)),
    onNewMsg: (data) => dispatch(actions.newMsg(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
