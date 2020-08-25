import React from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import styles from "./TimerForm.module.scss"
import FormInput from "../FormInput/FormInput"
import customValidator from "../../validators/validator"
import Schems from "../../validators/validationSchems"
import * as actionCreator from "../../actions/actionCreator"
import TimerDateInput from "../TimerDateInput/TimerDateInput"

const TimerForm = (props) => {
  const {
    initialValues,
    handleSubmit,
    submitting,
    reset,
    createTimer,
    deleteTimer,
    updateTimer,
    clearCurrentTimer,
  } = props

  const submit = (values) => {
    if (initialValues) {
      const { name, finalDate, warnDate } = values
      const newTimer = {
        id: initialValues.id,
        name,
        finalDate,
        warnDate,
      }
      updateTimer(newTimer)
    } else {
      createTimer(values)
      reset()
    }
  }

  const deleteHandler = () => {
    if (initialValues) {
      const { name, finalDate, warnDate, id } = initialValues
      deleteTimer({ name, finalDate, warnDate, id })
    }
    clearCurrentTimer()
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <i className="fas fa-times" onClick={deleteHandler} />

      <Field
        name="name"
        component={FormInput}
        classes={{
          container: styles.defaultClass,
          input: styles.inputClass,
          warning: styles.errorTip,
          notValid: styles.invalidClass,
          valid: styles.validClass,
        }}
        type="text"
        label="Enter a Timer name"
      />

      <Field
        name="warnDate"
        component={TimerDateInput}
        classes={{
          container: styles.defaultClass,
          input: styles.inputClass,
          warning: styles.errorTip,
          notValid: styles.invalidClass,
          valid: styles.validClass,
          label: styles.dateLabel,
        }}
        label="select a warning date"
        placeholder="Warning date"
      />

      <Field
        name="finalDate"
        component={TimerDateInput}
        classes={{
          container: styles.defaultClass,
          input: styles.inputClass,
          warning: styles.errorTip,
          notValid: styles.invalidClass,
          valid: styles.validClass,
          label: styles.dateLabel,
        }}
        label="select a final date"
        placeholder="Final date"
      />
      <button type="submit" disabled={submitting}>
        Submit
      </button>
    </form>
  )
}

const mapStateToProps = (state) => ({
  initialValues: state.timerStore.currentTimer,
})

const mapDispatchToProps = (dispatch) => ({
  createTimer: (data) => dispatch(actionCreator.createCreateTimerAction(data)),
  deleteTimer: (data) => dispatch(actionCreator.createDeleteTimerAction(data)),
  updateTimer: (data) => dispatch(actionCreator.createUpdateTimerAction(data)),
  clearCurrentTimer: () => dispatch(actionCreator.clearCurrentTimer()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: "timer",
    enableReinitialize: true,
    validate: customValidator(Schems.TimerForm),
  })(TimerForm)
)
