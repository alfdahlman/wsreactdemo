import React from  'react';
import classes from './chatSubmit.module.css';

const chatSubmit = React.forwardRef((props, ref) => {
  return (
    <div className={classes.Submit}>
        <input
          ref={ref}
          type="text"
          value={props.val}
          onChange={props.change}></input>
        <button
          onClick={props.send}>send msg</button>

    </div>

  );
});

export default chatSubmit;
