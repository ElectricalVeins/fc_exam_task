import React from 'react';
import PropTypes from 'prop-types';

const UserInfoBlock = props => {
  const { styles:{infoBlock, label, info}, description, property }=props;

  return (
    <div className={ infoBlock }>
      <span className={ label }>{ description }</span>
      <span className={ info }>{ property }</span>
    </div>
  );
};

UserInfoBlock.propTypes = {
  description: PropTypes.string,
  property: PropTypes.string.isRequired,
  styles: PropTypes.shape({
    infoBlock: PropTypes.string,
    label: PropTypes.string,
    info: PropTypes.string,
  }),
};

export default UserInfoBlock;