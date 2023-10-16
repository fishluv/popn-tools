import React from "react"
import styles from "./Card.module.scss"
import cx from "classnames"

interface BigPillLinkProps {
  title: string
  color: "red" | "yellow" | "green" | "blue"
}

export default function BigPillLink({ title, color }: BigPillLinkProps) {
  return (
    <div className={cx(styles.Card, styles[color])}>
      <p className={styles.title}>{title}</p>
    </div>
  )
}
