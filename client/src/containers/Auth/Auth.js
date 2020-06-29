import React, {Component} from 'react';
import axios from '../../axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/actions';
import Input from '../../components/UI/Input/Input';
import authForm from './form';
import classes from './Auth.module.css';

class Auth extends Component {
  state = {
    authForm: authForm,
    formError: null,
    isLogin: true
  }

  checkValidity(value, rules){
    let isValid = true;

    if(rules.required){ isValid = value.trim() !== '' && isValid; }
    if(rules.minLength){ isValid = value.length >= rules.minLength && isValid; }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {

    const updatedAuthForm = {
      ...this.state.authForm,
      [inputIdentifier]: {
        ...this.state.authForm[inputIdentifier],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.authForm[inputIdentifier].validation),
        touched: true
      }
    };

    this.setState({authForm: updatedAuthForm});
  }

  submitHandler = (event) => {
    event.preventDefault();

    const data = {
      email: this.state.authForm.email.value,
      password: this.state.authForm.password.value
    }

    if(this.state.isLogin){
      axios.post('/login', data)
        .then(response => {

          this.props.onAuthenticated(response.data.token, response.data.user, response.data.exp, this.props.socket);

          axios.get('/useronline/' + response.data.user._id, {
            headers: {
              Authorization: 'Bearer ' + response.data.token
            }
          }).then(response => {
            console.log('resp', response.data);
          }).catch(err => console.log(err)
          );

          this.props.onGetUsers(response.data.token);

        })
        .catch(error => {
          console.dir('error', error);
          this.setState({ formError: error.response.data })
        });
    }else{
      data['name'] = this.state.authForm.name.value
      axios.post('/register', data)
        .then(response => {
          const nextForm = {...this.state.authForm};
          delete nextForm.name;
          this.setState({ isLogin: true, authForm: nextForm })
        })
        .catch(error => {
          console.dir(error)
          this.setState({ formError: error.response.data })
        });
    }

  }

  switchFormHandler = () => {

    this.setState(prevState => {
      let nextForm = {};
      if(prevState.isLogin){
        nextForm = {
          name: {
            elementType: 'input',
            elementConfig: {
              type: 'name',
              placeholder: 'Your Name'
            },
          value: '',
          validation: {
            required: true,
          },
          valid: false,
          touched: false
        }, ...this.state.authForm
      };
      }else{
        nextForm = {...this.state.authForm};
        delete nextForm.name;
      }
      return {isLogin: !prevState.isLogin, authForm: nextForm}
    })
  }

  render(){

    const formElementsArray = [];
    for(let key in this.state.authForm){
      formElementsArray.push({
        id: key,
        config: this.state.authForm[key]
      });
    }

    let form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
    ));

    let authRedirect = null;
    if(this.props.isAuthenticated){
      authRedirect = <Redirect to="/" />
    }

    let errorMsg = null;
    if(this.state.formError){
      errorMsg = <p>{this.state.formError}</p>
    }

    return (
      <div className={classes.Auth}>
        { authRedirect }
        <div className={classes.FormArea}>
          { errorMsg }
          <form onSubmit={this.submitHandler}>
            { this.props.isAuthenticated ? null : form }
            <button className={classes.Submit} type="submit">{this.state.isLogin ? 'Login' : 'Signup'}</button>
          </form>
          <p onClick={this.switchFormHandler} style={{fontSize: '12px'}}>{this.state.isLogin ? 'Switch to sign up' : 'Switch to login'}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
    socket: state.socket
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuthenticated: (token, user, exp, socket) => dispatch(actions.authenticated(token, user, exp, socket)),
    onGetUsers: (token) => dispatch(actions.getUsers(token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
