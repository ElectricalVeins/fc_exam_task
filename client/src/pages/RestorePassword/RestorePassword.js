import React from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import styles from './RestorePassword.module.sass'
import CONSTANTS from "../../constants";
import RestorePasswordForm from "../../components/RestorePasswordForm/RestorePasswordForm";
import queryString from 'query-string';
import {createUpdatePasswordAction} from "../../actions/actionCreator";

const RestorePassword = props => {
    const {updatePassword, history} = props;
    const {token} = queryString.parse(window.location.search);

    const updatePasswordQuery = () => {
        //TODO:отображать спиннер до результата(ответа) этого запроса.
        // после выводить сообщение и перекидывать на логин
        updatePassword({token})
        setTimeout(() => history.replace('/login'), 5000)

        return (
            <span style={{color: 'white', alignItems: 'center', justifyContent: 'center'}}>
            Your password will be reset. Wait until redirect.
        </span>
        )
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.headerRestorePage}>
                <Link to='/'>
                    <img src={`${CONSTANTS.STATIC_IMAGES_PATH}logo.png`} alt="logo"/>
                </Link>
                <Link to='/' className={styles.linkButton}>
                    <span>Back to Main Page</span>
                </Link>
            </div>
            <div className={styles.restoreFormContainer}>
                {
                    token
                        ? updatePasswordQuery()
                        : <>
                            <h1>Password Restore Form</h1>
                            <RestorePasswordForm/>
                        </>
                }
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const {auth} = state;
    return {auth};
};

const mapDispatchToProps = (dispatch) => ({
    updatePassword: (token) => dispatch(createUpdatePasswordAction(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(RestorePassword);