import React, {Component} from 'react';
import * as actions from '../../store/actions/actions';
import { connect } from 'react-redux';

import HeaderImg from '../../img/header.svg';
import classes from './Header.module.css';

class Header extends Component {
  render(){
    let nav = null;
    if(this.props.user){
      nav = (
        <div className={classes.Nav}>
          { this.props.recipient?.[0] ?
            <p onClick={this.props.onUnsetRecipient}>back</p>:
            null
          }
          <p>{this.props.recipient?.[1]?.name}</p>
          <p onClick={() => this.props.onLogoutUser(this.props.user?._id)}>Logga ut</p>
        </div>
      );
    }
    return (
      <div className={classes.Header}>
        <img src={HeaderImg} alt="graphic pattern"/>
        {nav}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    recipient: state.recipient
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUnsetRecipient: () => dispatch(actions.unsetRecipient()),
    onLogoutUser: (id) => dispatch(actions.logoutUser(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
