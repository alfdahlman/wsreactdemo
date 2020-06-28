import React from  'react';
import classes from './ChatString.module.css';

const chatString = (props) => {
  console.log('chatString', props);
  const stringStyle = classes[props.stringStyle]
  return (
    <div className={stringStyle + ' ' + classes.String}>
      <p>{props.children}</p>
    </div>
  );
}

export default chatString;
