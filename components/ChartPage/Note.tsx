import cx from "classnames"
import styles from "./Note.module.scss"
import { CSSProperties } from "react"

export type NoteColor = "white" | "yellow" | "green" | "blue" | "red"

interface NoteProps {
  className?: string
  style?: CSSProperties
  color: NoteColor
}

export default function Note({ className, style, color }: NoteProps) {
  return (
    <div className={cx(styles.Note, styles[color], className)} style={style}>
      <div className={styles.inside} />
      <div className={styles.stripe} />
      <div className={styles.outline} />
    </div>
  )
}
