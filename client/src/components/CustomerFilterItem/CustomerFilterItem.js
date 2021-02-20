import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

const CustomerFilterItem = (props) => {
  const {
    newFilter,
    status,
    customerFilter,
    classes: { activeFilter, filter },
    ...restProps
  } = props

  const classNames = cx({
    [activeFilter]: status === customerFilter,
    [filter]: status !== customerFilter,
  })

  return (
    <div
      onClick={() => newFilter(status)}
      className={classNames}
      {...restProps}
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
