import React  from 'react';
import styles from './FormikInput.module.sass';

const FormikInput = ( { field, form, meta, ...rest } ) => {

  return (
    <label className={styles.container}>
      {
        rest.children
      }
      {
        meta.error && <div className={styles.errorTip}>{meta.error}</div>
      }
    </label>
  );
};

export default FormikInput;