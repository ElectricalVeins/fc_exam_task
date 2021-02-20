import React from 'react';
import { change } from 'redux-form';

class SelectInput extends React.Component {
  getOptionsArray = () => {
    const { optionsArray, valueArray } = this.props;

    return optionsArray.map((optionValue, i) => {
      return valueArray ? (
        <option key={i} value={valueArray[i]}>
          {optionValue}
        </option>
      ) : (
        <option key={i}>{optionValue}</option>
      );
    });
  };

  componentDidMount () {
    const {
      valueArray,
      optionsArray,
      input,
      meta: { dispatch, form, initial },
    } = this.props;
    
    if (!initial && optionsArray)
      dispatch(
        change(form, input.name, valueArray ? valueArray[0] : optionsArray[0])
      );
  }

  render () {
    const { input, header, classes } = this.props;
    return (
      <div className={classes.inputContainer}>
        <span className={classes.inputHeader}>{header}</span>
        <select {...input} className={classes.selectInput}>
          {this.getOptionsArray()}
        </select>
      </div>
    );
  }
}

export default SelectInput;
