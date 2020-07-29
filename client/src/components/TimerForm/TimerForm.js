import React from 'react';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import classNames from 'classnames';
import FormikInput from "../FormikInput/FormikInput";
import styles from './TimerForm.module.scss';

const nameSchema = yup.string()
                      .min( 4, 'Minimum 4 symbols required' )
                      .max( 16, 'Maximum 16 symbols allowed' )
                      .required( 'This area is required' );
const dateSchema = yup.date( 'Please Enter a proper Date' )
                      .min( new Date() )
                      .required( 'This area is required' );

const TimerForm = props => {
  const { submitHandler } = props;

  const handleSubmit = ( event, { resetForm } ) => {
    submitHandler( event );
    resetForm();
  };

  const nameValidate = async ( value ) => {
    try {
      await nameSchema.validate( value );
    } catch ( e ) {
      return e.message;
    }
  };

  const dateValidate = async ( value ) => {
    try {
      await dateSchema.validate( value );
    } catch ( e ) {
      return e.message;
    }
  };

  const validateForm = async ( { finalDate, warnDate } ) => {
    const errors = {};
    if( moment( warnDate ).isAfter( finalDate ) ) {
      errors.warnDate = 'Warning time must be before selected date';
    }
    return errors;
  };

  return (
    <Formik validate={validateForm}
            initialValues={{
              name: '',
              finalDate: new Date(),
              warnDate: new Date(),
            }}
            onSubmit={handleSubmit}>
      {
        props => ( <Form>
          <Field validate={nameValidate} name="name">
            {
              fieldProps => {
                const { field, form, meta, ...rest } = fieldProps;

                const inputClassNames = classNames( styles.defaultClass, {
                  [ styles.invalidClass ]: meta.touched && meta.error,
                  [ styles.validClass ]: meta.touched && !meta.error,
                } );
                return (
                  <FormikInput {...fieldProps}>
                    <span>Enter A Timer Name</span>
                    <input className={inputClassNames} {...field} {...rest}
                           placeholder='Enter a Timer name'/>
                  </FormikInput>
                )
              }
            }
          </Field>

          <Field name="finalDate" validate={dateValidate}>
            {
              fieldProps => {
                const { field: { value, name }, form, meta, ...rest } = fieldProps
                return (
                  <FormikInput {...fieldProps}>
                    <span>Select the date</span>
                    <DatePicker selected={( value && new Date( value ) ) || null}
                                onChange={value => form.setFieldValue( name, value )}
                                placeholderText="Click to select a date"
                                isClearable
                                showMonthDropdown
                                showYearDropdown
                                showTimeInput
                                minDate={new Date()}
                                popperModifiers={{
                                  preventOverflow: {
                                    enabled: true,
                                    escapeWithReference: false,
                                    boundariesElement: "viewport"
                                  }
                                }}
                                {...rest}/>
                  </FormikInput>
                )
              }
            }
          </Field>

          <Field name="warnDate" validate={dateValidate}>
            {
              fieldProps => {
                const { field: { value, name }, form, meta, ...rest } = fieldProps
                return (
                  <FormikInput {...fieldProps}>
                    <span>Select The Warning Time</span>
                    <DatePicker selected={( value && new Date( value ) ) || null}
                                onChange={value => form.setFieldValue( name, value )}
                                placeholderText="Click to select a warning date"
                                isClearable
                                showMonthDropdown
                                showYearDropdown
                                showTimeInput
                                minDate={new Date()}
                                popperModifiers={{
                                  preventOverflow: {
                                    enabled: true,
                                    escapeWithReference: false,
                                    boundariesElement: "viewport"
                                  }
                                }}
                                {...rest}/>
                  </FormikInput>
                )
              }
            }
          </Field>

          <button type="submit">Submit</button>
        </Form> )
      }
    </Formik>
  );
};

TimerForm.propTypes = {};

export default TimerForm;