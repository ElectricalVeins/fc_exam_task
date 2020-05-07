import React                    from 'react';
import PropTypes                from 'prop-types';
import moment                   from 'moment';
import { Formik, Form, Field, } from 'formik';
import * as yup                 from 'yup';
import FormikInput              from "../FormikInput/FormikInput";
import FormikDateInput          from "../FormikDateInput/FormikDateInput";

const nameSchema = yup.string().min( 4 ).max( 16 ).required();
const dateSchema = yup.date().min( new Date() );

const TimerForm = props => {

  const handleSubmit = ( object ) => {
    console.log( object )
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
      await dateSchema.validate( value )
    } catch ( e ) {
      return e.message;
    }
  }

  const warningTimeValidate = async ( value ) => {
    try {
      await dateSchema.validate( value )
    } catch ( e ) {
      return e.message;
    }
  }

  const validateForm = async ( { date, warningTime } ) => {
    const errors = {};
    if( moment( warningTime ).isAfter( date ) ) {
      errors.warningTime = 'Warning time must be before selected date';
    }
    return errors;
  };

  return (
    <Formik validate={validateForm}
            initialValues={{
              name: '',
              date: new Date(),
              warningTime: new Date(),
            }}
            onSubmit={handleSubmit}>
      {
        props => (
          <Form onSubmit={props.handleSubmit}>
            <Field validate={nameValidate}
                   type="text"
                   name="name"
                   onChange={( e ) => console.log( e.target.value )}>
              {
                ( fieldProps ) => <FormikInput {...fieldProps} placeholder={'Enter Timer Name'}/>
              }
            </Field>
            <Field name="date" validate={dateValidate}>
              {
                ( fieldProps ) => <FormikDateInput placeholderText="Click to select a date"
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
                                                   {...fieldProps}/>
              }
            </Field>

            <Field validate={warningTimeValidate} name="warningTime">{
              ( fieldProps ) => <FormikDateInput placeholderText="Click to select a warning date"
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
                                                 {...fieldProps}/>
            }
            </Field>
            <button type="submit">Submit</button>
          </Form>
        )
      }
    </Formik>
  );
};

TimerForm.propTypes = {};

export default TimerForm;