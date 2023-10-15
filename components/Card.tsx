import React from "react"
import styles from "./Card.module.scss"
import cx from "classnames"

type Color = "red"
interface CardProps {
  title: string
  color: Color
}

export default function Card({ title, color }: CardProps) {
  return (
    <div className={cx(styles.Card, styles[color])}>
      <p className={styles.title}>{title}</p>
    </div>
  )
}
