import React from 'react';
import {connect} from 'react-redux';
import {authActionLogin, clearAuth} from "../../actions/actionCreator";
import styles from './LoginForm.module.sass';
import {Field, reduxForm} from 'redux-form';
import FormInput from '../FormInput/FormInput';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';


class LoginForm extends React.Component {

    componentWillUnmount() {
        this.props.authClear();
    }

    submitHandler = (values) => {
        this.props.loginRequest(values);
    };

    render() {
        const {isFetching} = this.props.auth;
        const {handleSubmit, submitting} = this.props;
        const inputStyles = {
          container: styles.inputContainer,
          input: styles.input,
          warning: styles.fieldWarning,
          notValid: styles.notValid
        }
        return (
                <form onSubmit={handleSubmit(this.submitHandler)}>
                    <Field
                        name='email'
                        classes={inputStyles}
                        component={FormInput}
                        type='text'
                        label='Email Address'
                    />
                    <Field
                        name='password'
                        classes={inputStyles}
                        component={FormInput}
                        type='password'
                        label='password'
                    />
                    <button type='submit' disabled={submitting} className={styles.submitContainer}>
                        <span className={styles.inscription}>{isFetching ? 'Submitting...' : 'LOGIN'}</span>
                    </button>
                </form>
        );
    }
}

const mapStateToProps = (state) => {
    const {auth} = state;
    return {auth};
};

const mapDispatchToProps = (dispatch) => (
    {
        loginRequest: (data) => dispatch(authActionLogin(data)),
        authClear: () => dispatch(clearAuth())
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'login',
    validate: customValidator(Schems.LoginSchem)
})(LoginForm));