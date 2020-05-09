import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import styles from './RestorePassword.module.sass'
import CONSTANTS from "../../constants";
import RestorePasswordForm from "../../components/RestorePasswordForm/RestorePasswordForm";

const RestorePassword = props => {
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
                <h1>Password Restore Form</h1>
                <RestorePasswordForm/>
            </div>
        </div>
    );
};

RestorePassword.propTypes = {};

export default RestorePassword;