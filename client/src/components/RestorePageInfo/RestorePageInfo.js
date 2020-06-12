import React, { useEffect } from 'react';
import styles from "../../pages/RestorePassword/RestorePassword.module.sass";
import SpinnerLoader from "../Spinner/Spinner";
import { toast } from 'react-toastify';

const RestorePageInfo = props => {
  const { history, token, updatePassword, isFetching, error, data } = props;

  useEffect( () => {
    if( !isFetching && !error && !data ) {
      updatePassword( { token } );
    }
    if( data ) {
      toast(data);
      setTimeout( () => history.replace( '/login' ), 3000 );
    }
  }, [ data ] );

  return <div className={styles.passwordSuccessChange}>
    {
      isFetching && <SpinnerLoader color={'white'}/>
    }
    {
      data && <span>Your password will be reset. Wait until redirect.</span>
    }
  </div>
}

export default RestorePageInfo;
