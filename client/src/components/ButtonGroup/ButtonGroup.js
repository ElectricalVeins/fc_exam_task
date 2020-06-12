import React, { useState } from 'react';
import Button              from "../Button/Button";
import styles              from './ButtonGroup.module.sass'

const ButtonGroup = props => {

  const [ inputValue, setInputValue ] = useState( '' )

  const clickHandler = ( value ) => {
    setInputValue( value )
  }

  return (
    <div className={styles.groupContainer}>
      <input name='url_need' type="hidden" value={inputValue} readOnly/>
      <Button clickHandler={clickHandler}
              value='as name'
              inputValue={inputValue}
              description='The Domain should exactly match the name'/>
      <Button clickHandler={clickHandler}
              value='yes'
              inputValue={inputValue}
              description='But minor variations are allowed (Recommended)'/>
      <Button clickHandler={clickHandler}
              value='no'
              inputValue={inputValue}
              description='I am only looking for a name, not a Domain'/>

    </div>
  );
};

export default ButtonGroup;