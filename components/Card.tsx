import React from "react"
import styles from "./Card.module.scss"
import cx from "classnames"

interface CardProps {
  title: string
  color: "red" | "yellow" | "green" | "blue"
}

export default function Card({ title, color }: CardProps) {
  return (
    <div className={cx(styles.Card, styles[color])}>
      <p className={styles.title}>{title}</p>
    </div>
  )
}
