import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const CustomerFilterItem = props => {
  const {newFilter, status, customerFilter, classes:{activeFilter, filter}} = props;

  return (
    <div onClick={ () => newFilter(status) }
         className={ classNames({
           [activeFilter]: status === customerFilter,
           [filter]: status !== customerFilter
         }) }>
      {
        props.children
      }
    </div>
  );
};

CustomerFilterItem.propTypes = {
  newFilter: PropTypes.func.isRequired,
  status: PropTypes.string,
  customerFilter: PropTypes.string,
  classes: PropTypes.object,
};

export default CustomerFilterItem;