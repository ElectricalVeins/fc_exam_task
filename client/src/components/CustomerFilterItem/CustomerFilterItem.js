import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

const CustomerFilterItem = (props) => {
  const {
    newFilter,
    status,
    customerFilter,
    classes: { activeFilter, filter },
  } = props

  const classNames = cx({
    [activeFilter]: status === customerFilter,
    [filter]: status !== customerFilter,
  })

  return (
    <div
      onClick={() => newFilter(status)}
      className={classNames}
      {...props}
    />
    
  )
}

CustomerFilterItem.propTypes = {
  newFilter: PropTypes.func.isRequired,
  status: PropTypes.string,
  customerFilter: PropTypes.string,
  classes: PropTypes.object,
}

export default CustomerFilterItem
