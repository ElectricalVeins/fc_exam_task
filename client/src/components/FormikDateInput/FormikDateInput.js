import React      from 'react';
import DatePicker from 'react-datepicker'
import styles     from './FormikDateInput.module.sass'
import "react-datepicker/dist/react-datepicker.css"

const FormikDateInput = ( props ) => {
  console.log( props )
  const { field: { value, name }, form, meta, ...rest } = props

  return (
    <label>
      <DatePicker selected={( value && new Date( value ) ) || null}
                  onChange={value => form.setFieldValue( name, value )}
                  {...rest}/>
      {
        meta.error && <div>{meta.error}</div>
      }
    </label>
  );
};

export default FormikDateInput;