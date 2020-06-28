const authForm = {
  email: {
    elementType: 'input',
    elementConfig: {
      type: 'email',
      placeholder: 'Your Email'
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false
  },
  password: {
    elementType: 'input',
    elementConfig: {
      type: 'password',
      placeholder: 'password',
      autoComplete: 'current password'
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false
  }
};

export default authForm;
