import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import moment from "moment"
import classNames from "classnames"
import { LinearProgress } from "@material-ui/core"
import styles from "./Timer.module.sass"
import ACTION from "../../actions/actionTypes"

const Timer = (props) => {
  const {
    id,
    name,
    finalDate,
    createdAt,
    warnDate,
    itemClass,
    openEditor,
    closeEditor,
  } = props

  const checkWarn = () => moment(warnDate).isBefore(new Date())
  const checkProgress = () => setProgress(definePercent())

  const [progress, setProgress] = useState(0)
  const [isWarning, setWarning] = useState(checkWarn())

  const intervalHandler = () => {
    checkProgress()
    checkWarn() && setWarning(true) // можно вызвать toast для доп. уведомления
  }

  useEffect(() => {
    checkProgress() // initial definition of the progress bar percentage
    const interval = setInterval(intervalHandler, 5000)
    return () => {
      clearInterval(interval)
    }
  })

  const definePercent = () => {
    const createdTime = Date.parse(createdAt)
    const total = Date.parse(finalDate) - createdTime
    const current = Date.parse(new Date()) - createdTime
    const result = 100 / (total / current)

    return result > 100 ? 100 : result
  }

  const listStyles = classNames(styles.listItem, itemClass)

  const renderWarning = () => {
    return <>{isWarning && <span className={styles.warn} title={warnDate} />}</>
  }

  const openEditorHandler = () => {
    openEditor({ id, name, finalDate, createdAt, warnDate })
  }

  return (
    <li
      className={listStyles}
      title="Edit current timer"
      onClick={openEditorHandler}
    >
      {renderWarning()}
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.time}>{moment().to(finalDate, true)}</span>
      </div>
      <LinearProgress
        value={+progress}
        variant="determinate"
        classes={{
          root: styles.progressBar,
          colorPrimary: styles.colorPrimary,
          barColorPrimary: styles.barColorPrimary,
        }}
      />
    </li>
  )
}

const mapDispatchToProps = (dispatch) => ({
  openEditor: (timer) =>
    dispatch({ type: ACTION.OPEN_EDIT_TIMER_FORM, data: timer }),
  closeEditor: () => dispatch({ type: ACTION.OPEN_CREATE_TIMER_FORM }),
})

export default connect(null, mapDispatchToProps)(Timer)
