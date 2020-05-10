import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import FormInput from '../FormInput/FormInput';
import customValidator from "../../validators/validator";
import Schems from "../../validators/validationSchems";
import loginPageStyles from "../LoginForm/LoginForm.module.sass";
import {createRestorePasswordAction} from "../../actions/actionCreator";

const RestorePasswordForm = props => {
    const {handleSubmit, submitting, reset, restoreRequest} = props;

    // useEffect(() => {
    //     return () => reset()
    // })

    console.log(props)

    const sendRequest = (data) => {
        console.log(data)
        restoreRequest(data)
        reset() // сделать action по успешной обработке
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
                <span>Confirm</span>
            </button>
        </form>
    );
};

RestorePasswordForm.propTypes = {};

const mapStateToProps = (state) => {
    const {auth} = state;
    return {auth};
};

const mapDispatchToProps = (dispatch) => ({
    //restorePass Request
    restoreRequest: (data) => dispatch(createRestorePasswordAction(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'passwordRestore',
    validate: customValidator(Schems.PasswordRestore)
})(RestorePasswordForm));