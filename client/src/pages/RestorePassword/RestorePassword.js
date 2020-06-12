import React from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import styles from './RestorePassword.module.sass'
import CONSTANTS from "../../constants";
import RestorePasswordForm from "../../components/RestorePasswordForm/RestorePasswordForm";
import queryString from 'query-string';
import {
    createClearPasswordReecoverStateAction,
    createUpdatePasswordAction
} from "../../actions/actionCreator";
import Error from "../../components/Error/Error";
import RestorePageInfo from "../../components/RestorePageInfo/RestorePageInfo";

const RestorePassword = props => {
    const { history,clearState, passwordRecover: { isFetching, error, data,formResult } } = props;
    const {token} = queryString.parse(window.location.search);

    const clearError = ()=>{
        clearState()
        history.replace('/restorePassword')
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
                    error && <Error status={error.status}
                                    data={error.data}
                                    clearError={clearError}/>
                }
                {
                    token
                    ? <RestorePageInfo token={token}
                                       clearError={clearError}
                                       history={history}
                                       updatePassword={props.updatePassword}
                                       isFetching={isFetching}
                                       error={error}
                                       data={data}/>
                        : <>
                            <h1>Password Restore Form</h1>
                            <RestorePasswordForm formResult={formResult}/>
                        </>
                }
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const {passwordRecover} = state;
    return {passwordRecover};
};

const mapDispatchToProps = (dispatch) => ({
    updatePassword: (token) => dispatch(createUpdatePasswordAction(token)),
    clearState: ()=> dispatch(createClearPasswordReecoverStateAction())
});

export default connect(mapStateToProps,mapDispatchToProps)(RestorePassword);


