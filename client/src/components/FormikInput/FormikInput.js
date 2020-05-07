import React      from 'react';
import PropTypes  from 'prop-types';
import styles     from './FormikInput.sass'
import classNames from 'classnames'

const FormikInput = ( { field, form, meta, ...rest } ) => {

  const inputClassNames = classNames( styles.defaultClass, {
    [ styles.invalidClass ]: meta.touched && meta.error,
    [ styles.validClass ]: meta.touched && !meta.error,
  } );

  return (
    <label className={styles.container}>
      <input className={inputClassNames} {...field} {...rest} />
      {
        meta.error && <div className={styles.errorTip}>{meta.error}</div>
      }
    </label>
  );
};

FormikInput.propTypes = {};

export default FormikInput;