import React from 'react';
import {connect} from "react-redux";
import _ from 'lodash'
import {authActionRegister, clearAuth} from '../../actions/actionCreator';
import styles from './RegistrationForm.module.sass';
import {Field, reduxForm} from 'redux-form';
import FormInput from '../FormInput/FormInput';
import RoleInput from '../RoleInput/RoleInput';
import AgreeTermOfServiceInput from '../AgreeTermOfServiceInput/AgreeTermOfServiceInput';
import CONSTANTS from '../../constants';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';


class RegistrationForm extends React.Component {

    componentWillUnmount() {
        this.props.authClear();
    }

    submitHandler = (values) => {
        this.props.register(_.omit(values,['agreeOfTerms','confirmPassword']));
    };

    render() {
        const {handleSubmit, submitting} = this.props;
        const inputStyles = {
          container: styles.inputContainer,
          input: styles.input,
          warning: styles.fieldWarning,
          notValid: styles.notValid
        }
        return (
                <form onSubmit={handleSubmit(this.submitHandler)}>
                    <div className={styles.row}>
                        <Field
                            name='firstName'
                            classes={inputStyles}
                            component={FormInput}
                            type='text'
                            label='First name'
                        />
                        <Field
                            name='lastName'
                            classes={inputStyles}
                            component={FormInput}
                            type='text'
                            label='Last name'
                        />
                    </div>
                    <div className={styles.row}>
                        <Field
                            name='displayName'
                            classes={inputStyles}
                            component={FormInput}
                            type='text'
                            label='Display Name'
                        />
                        <Field
                            name='email'
                            classes={inputStyles}
                            component={FormInput}
                            type='text'
                            label='Email Address'
                        />
                    </div>
                    <div className={styles.row}>
                        <Field
                            name='password'
                            classes={inputStyles}
                            component={FormInput}
                            type='password'
                            label='Password'
                        />
                        <Field
                            name='confirmPassword'
                            classes={inputStyles}
                            component={FormInput}
                            type='password'
                            label='Password confirmation'
                        />
                    </div>
                    <div className={styles.choseRoleContainer}>
                        <Field name='role'
                               type='radio'
                               value={CONSTANTS.CUSTOMER}
                               strRole='Join As a Buyer'
                               infoRole='I am looking for a Name, Logo or Tagline for my business, brand or product.'
                               component={RoleInput}
                               id={CONSTANTS.CUSTOMER}/>
                        <Field name='role'
                               type='radio'
                               value={CONSTANTS.CREATOR}
                               strRole='Join As a Creative'
                               infoRole='I plan to submit name ideas, Logo designs or sell names in Domain Marketplace.'
                               component={RoleInput}
                               id={CONSTANTS.CREATOR}/>
                    </div>
                    <div className={styles.termsOfService}>
                        <Field
                            name='agreeOfTerms'
                            classes={{
                                container: styles.termsOfService,
                                warning: styles.fieldWarning
                            }}
                            id='termsOfService'
                            component={AgreeTermOfServiceInput}
                            type='checkbox'
                        />
                    </div>
                    <button type='submit'
                            disabled={submitting}
                            className={styles.submitContainer}>
                        <span className={styles.inscription}>Create Account</span>
                    </button>
                </form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        initialValues: {
            role: CONSTANTS.CUSTOMER
        }
    }
};

const mapDispatchToProps = (dispatch) => (
    {
        register: (data) => dispatch(authActionRegister(data)),
        authClear: () => dispatch(clearAuth())
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'login',
    validate: customValidator(Schems.RegistrationSchem)
})(RegistrationForm));