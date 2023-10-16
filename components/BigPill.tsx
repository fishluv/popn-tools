import React from "react"
import styles from "./BigPill.module.scss"
import cx from "classnames"

interface BigPillProps {
  title: string
  color: "red" | "yellow" | "green" | "blue"
}

export default function BigPill({ title, color }: BigPillProps) {
  return (
    <div className={cx(styles.BigPill, styles[color])}>
      <p className={styles.title}>{title}</p>
    </div>
  )
}
