import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import { toast }                    from 'react-toastify';
import FormInput from '../FormInput/FormInput';
import customValidator from "../../validators/validator";
import Schems from "../../validators/validationSchems";
import loginPageStyles from "../LoginForm/LoginForm.module.sass";
import {createRestorePasswordAction} from "../../actions/actionCreator";

const RestorePasswordForm = props => {
    const {handleSubmit, submitting, reset, restoreRequest, formResult} = props;

     useEffect(()=>{
        formResult && toast( formResult )
     },[formResult])

    const sendRequest = (values) => {
        const data = {
            email: values.email,
            password: values.password,
        }
        restoreRequest(data)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(sendRequest)}>
            <Field name='email'
                   type='text'
                   label='Enter your Email'
                   classes={{
                       container: loginPageStyles.inputContainer,
                       input: loginPageStyles.input,
                       warning: loginPageStyles.fieldWarning,
                       notValid: loginPageStyles.notValid
                   }}
                   component={FormInput}/>
            <Field name='password'
                   type='password'
                   label='Enter new Password'
                   classes={{
                       container: loginPageStyles.inputContainer,
                       input: loginPageStyles.input,
                       warning: loginPageStyles.fieldWarning,
                       notValid: loginPageStyles.notValid
                   }}
                   component={FormInput}/>
            <Field name='confirmPassword'
                   type='password'
                   label='Confirm new Password'
                   classes={{
                       container: loginPageStyles.inputContainer,
                       input: loginPageStyles.input,
                       warning: loginPageStyles.fieldWarning,
                       notValid: loginPageStyles.notValid
                   }}
                   component={FormInput}/>
            <button type='submit' disabled={submitting} className={loginPageStyles.submitContainer}>
                <span>{submitting ? 'Submitting...' : 'Confirm'}</span>
            </button>
        </form>
    );
};

const mapDispatchToProps = dispatch => ({
    restoreRequest: (data) => dispatch(createRestorePasswordAction(data))
});

export default connect(null, mapDispatchToProps)(reduxForm({
    form: 'passwordRestore',
    validate: customValidator(Schems.PasswordRestore)
})(RestorePasswordForm));