import React from "react"
import styles from "./BigPill.module.scss"
import cx from "classnames"
import Link from "next/link"

interface BigPillProps {
  title: string
  color: "red" | "yellow" | "green" | "blue" | "purple"
  href?: string
}

export default function BigPill({ title, color, href }: BigPillProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cx(styles.BigPill, styles[color], styles.clickable)}
      >
        <p className={styles.title}>{title}</p>
      </Link>
    )
  } else {
    return (
      <div className={cx(styles.BigPill, styles[color])}>
        <p className={styles.title}>{title}</p>
      </div>
    )
  }
}
