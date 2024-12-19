import cx from "classnames"
import styles from "./HoldNote.module.scss"
import { CSSProperties } from "react"
import Note, { colorToRow, NoteColor, Row } from "./Note"

interface HoldNoteProps {
  className?: string
  style?: CSSProperties
  color: NoteColor
  row?: Row // If absent, defaults based on color.
  yDuration: number
  shouldDrawHead: boolean
  shouldDrawButt: boolean
  shouldColorHeadOnly: boolean
}

export default function HoldNote({
  className,
  style,
  color,
  row,
  yDuration,
  shouldDrawHead,
  shouldDrawButt,
  shouldColorHeadOnly,
}: HoldNoteProps) {
  const rootStyle = {
    height: yDuration + 7,
    ...style,
  }
  const bodyStyle = {
    height: yDuration + 2,
  }

  const rowToUse = row ?? colorToRow(color)

  return (
    <div
      className={cx(
        styles.HoldNote,
        styles[color],
        styles[rowToUse],
        shouldColorHeadOnly ? styles.colorHeadOnly : styles.colorAll,
        className,
      )}
      style={rootStyle}
    >
      {shouldDrawButt && <div className={styles.butt} />}
      <div className={styles.body} style={bodyStyle} />
      {shouldDrawHead && (
        <Note className={styles.head} color={color} row={row} />
      )}
    </div>
  )
}
