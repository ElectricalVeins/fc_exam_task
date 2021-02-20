import React from "react"
import { ClipLoader } from "react-spinners"
import styles from "./Spinner.module.sass"

const SpinnerLoader = (props) => {
  const { color } = props

  return (
    <div className={styles.loaderContainer}>
      <ClipLoader
        sizeUnit="px"
        css={"border-color: #46568a;"}
        size={50}
        color={color || "#46568a"}
        loading
      />
    </div>
  )
}

export default SpinnerLoader
