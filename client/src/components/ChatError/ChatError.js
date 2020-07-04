import React from 'react';
import { connect } from 'react-redux';
import styles from './ChatError.module.sass';

const ChatError = props=>{
    const {getData, data}=props;
    return(
        <div className={styles.errorContainer} onClick={()=>getData()}>
            <div className={styles.container}>
              <span>{data ? data : 'Server Error'}</span>

            </div><i className="fas fa-redo"/>
        </div>
    );
};

const mapStateToProps = (state) => {
  return state.chatStore.error;
};

export default connect(mapStateToProps)(ChatError);
