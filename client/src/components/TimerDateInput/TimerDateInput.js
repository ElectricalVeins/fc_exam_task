import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const TimerDateInput = (props) => {
  const {
    input,
    placeholder,
    label,
    classes,
    meta: { touched, error },
    ...rest
  } = props
  console.log(props)
  return (
    <div className={classes.container}>
      <span className={classes.dateLabel}>{label}</span>
      <DatePicker
        id={input.name}
        selected={(input.value && new Date(input.value)) || new Date()}
        onChange={input.onChange}
        placeholderText={placeholder}
        isClearable
        showMonthDropdown
        showYearDropdown
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={5}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
        minDate={new Date()}
        popperModifiers={{
          preventOverflow: {
            enabled: true,
            escapeWithReference: false,
            boundariesElement: "viewport",
          },
        }}
        {...rest}
      />
      {error && touched && <span className={classes.warning}>{error}</span>}
    </div>
  )
}

export default TimerDateInput
