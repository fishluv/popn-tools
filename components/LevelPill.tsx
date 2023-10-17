import cx from "classnames"
import React from "react"
import styles from "./LevelPill.module.scss"

interface LevelPillProps {
  extraClass?: string
  difficulty: "e" | "n" | "h" | "ex"
  level: number
  style: "full" | "compact"
}

/**
 * Pill indicating a chart's level.
 */
export default class LevelPill extends React.Component<LevelPillProps> {
  render() {
    const { extraClass, difficulty, level, style } = this.props

    const rootClassName = cx(extraClass, styles.LevelPill, styles[difficulty], {
      [styles.compact]: style === "compact",
    })

    return (
      <span className={rootClassName}>
        {difficulty} {level}
      </span>
    )
  }
}
