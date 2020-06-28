import React from  'react';
import classes from './Input.module.css';

const input = (props) => {

  let inputElement = null;
  const  inputClasses = [classes.InputElement];
  const labelClasses = [classes.Label];

  if(props.invalid && props.shouldValidate && props.touched){
    inputClasses.push(classes.Invalid);
    labelClasses.push(classes.LabelInvalid);
  }

  switch (props.elementType){
    case('input'):
      inputElement = <input
        className={inputClasses.join(' ')}
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed}/>;
      break;
    case('textarea'):
      inputElement = <textarea
        className={inputClasses.join(' ')}
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed}/>;
      break;
    case('select'):
        inputElement = (
          <select
            className={inputClasses.join(' ')}
            value={props.value}
            onChange={props.changed}>
            {props.elementConfig.options.map(option => (
              <option
                key={option.value}
                value={option.value}>{option.displayValue}
                </option>
            ))}

          </select>
        )
      break;
    default:
      inputElement = <input
        className={classes.InputElement}
        {...props.elementConfig}
        value={props.value}/>;
  }

  return (
    <div className={classes.Input}>
      <label className={labelClasses.join(' ')}>{props.elementConfig.placeholder}</label>
      {inputElement}
    </div>
  );
}

export default input;
