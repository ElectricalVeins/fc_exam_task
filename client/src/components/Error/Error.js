import React from 'react';
import styles from './Error.module.sass';

const Error=props=>{
    const {clearError,status,data}=props;
    return(
        <div className={styles.errorContainer}>
            <span>{data}</span>
            <i className="far fa-times-circle" onClick={()=>clearError()}/>
        </div>
    )
};

export default Error;