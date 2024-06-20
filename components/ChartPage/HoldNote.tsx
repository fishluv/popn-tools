import cx from "classnames"
import styles from "./HoldNote.module.scss"
import { CSSProperties } from "react"
import Note, { NoteColor } from "./Note"

interface HoldNoteProps {
  className?: string
  style?: CSSProperties
  color: NoteColor
  yDuration: number
  shouldDrawHead: boolean
  shouldDrawButt: boolean
}

export default function HoldNote({
  className,
  style,
  color,
  yDuration,
  shouldDrawHead,
  shouldDrawButt,
}: HoldNoteProps) {
  const rootStyle = {
    height: yDuration + 7,
    ...style,
  }
  const bodyStyle = {
    height: yDuration + 2,
  }

  return (
    <div
      className={cx(styles.HoldNote, styles[color], className)}
      style={rootStyle}
    >
      {shouldDrawButt && <div className={styles.butt} />}
      <div className={styles.body} style={bodyStyle} />
      {shouldDrawHead && <Note className={styles.head} color={color} />}
    </div>
  )
}
