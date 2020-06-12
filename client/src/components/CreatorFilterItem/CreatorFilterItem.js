import React from 'react';
import PropTypes from 'prop-types';

const CreatorFilterItem = props => {

  const {containerStyles, inputStyles, name, type, handler, description, value} = props;

  const onChangeHandler = (event) => {
    handler({name, value: event.target.value})
  };

  return (
    <div className={containerStyles}>
      <span>{description}</span>
      {
        type === 'text'
          ? <input type='text' value={value} className={inputStyles} onChange={onChangeHandler}/>
          : <select onChange={onChangeHandler} value={value} className={inputStyles}>
            {
              props.children
            }
          </select>
      }
    </div>
  );
};

CreatorFilterItem.propTypes = {
  containerStyles: PropTypes.string,
  inputStyles: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  handler: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default CreatorFilterItem;