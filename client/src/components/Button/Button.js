import React      from 'react';
import PropTypes  from 'prop-types';
import classNames from 'classnames';
import styles     from "./Button.module.sass";

const Button = props => {
  const { clickHandler, value, description, Icon, inputValue } = props

  const divStyles = classNames( styles.container, {
    [ styles.selectedContainer ]: inputValue === value,
  } );

  const onClickHandler = () => {
    clickHandler( value )
  }

  return (
    <div onClick={onClickHandler} className={divStyles}>
      <div>
        {
          Icon ? Icon
               : <span className={styles.valueContainer}>{value}</span>
        }
      </div>
      <div className={styles.description}>
        {
          description
        }
      </div>
    </div>
  );
};

Button.propTypes = {
  clickHandler: PropTypes.func,
  value: PropTypes.string,
  inputValue: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.element,
};

export default Button;