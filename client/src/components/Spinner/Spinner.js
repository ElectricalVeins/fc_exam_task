import React from 'react';
import {ClipLoader} from 'react-spinners';
import {css} from '@emotion/core';
import styles from './Spinner.module.sass';

const override = css`border-color: #46568a;`;

const SpinnerLoader = props => {
  const { color } = props;

    return (
        <div className={styles.loaderContainer}>
            <ClipLoader
                sizeUnit={'px'}
                css={override}
                size={50}
                color={color || '#46568a'}
                loading={true}
            />
        </div>
    )
};


export default SpinnerLoader;