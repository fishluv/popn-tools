import cx from "classnames"
import styles from "./NoteIcon.module.scss"

/**
 * Decorative pop-kun note icon. Inline by default. Scale with font-size.
 */
export default function NoteIcon({
  className,
  color,
}: {
  className?: string
  color: "white" | "yellow" | "green" | "blue" | "red"
}) {
  return (
    <span className={cx(styles.NoteIcon, styles[color], className)}>
      <span className={styles.inside} />
      <span className={styles.stripe} />
    </span>
  )
}
