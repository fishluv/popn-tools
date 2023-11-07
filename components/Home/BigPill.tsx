import React from "react"
import styles from "./BigPill.module.scss"
import cx from "classnames"
import Link from "next/link"

interface BigPillProps {
  className?: string
  color: "red" | "yellow" | "green" | "blue" | "purple"
  href?: string
  children: React.ReactNode
}

export default function BigPill({
  className,
  color,
  href,
  children,
}: BigPillProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cx(
          className,
          styles.BigPill,
          styles[color],
          styles.clickable,
        )}
      >
        {children}
      </Link>
    )
  } else {
    return (
      <div className={cx(className, styles.BigPill, styles[color])}>
        {children}
      </div>
    )
  }
}
