import cx from "classnames"
import styles from "./Note.module.scss"
import { CSSProperties } from "react"

type NormalNoteColor = "white" | "yellow" | "green" | "blue" | "red"
type RhythmNoteColor =
  | "red"
  | "blue"
  | "purple"
  | "yellow"
  | "pink"
  | "orange"
  | "white"
export type NoteColor = NormalNoteColor | RhythmNoteColor

type Row = "bottom" | "top"

interface NoteProps {
  className?: string
  style?: CSSProperties
  color: NoteColor
  row?: Row // If absent, defaults based on color.
}

function colorToRow(color: NoteColor): Row {
  switch (color) {
    case "yellow":
    case "blue":
      return "top"
    default:
      return "bottom"
  }
}

export default function Note({ className, style, color, row }: NoteProps) {
  const rowToUse = row ?? colorToRow(color)

  return (
    <div
      className={cx(styles.Note, styles[color], styles[rowToUse], className)}
      style={style}
    >
      <div className={styles.inside} />
      <div className={styles.stripe} />
      <div className={styles.outline} />
    </div>
  )
}
