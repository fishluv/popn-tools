import cx from "classnames"
import React from "react"
import styles from "./LevelPill.module.scss"

interface LevelPillProps {
  className?: string
  difficulty: "e" | "n" | "h" | "ex"
  level: number
  style: "full" | "comfortable" | "compact"
}

function getFullDifficultyName(difficulty: "e" | "n" | "h" | "ex") {
  switch (difficulty) {
    case "e":
      return "easy"
    case "n":
      return "normal"
    case "h":
      return "hyper"
    default:
      return "ex"
  }
}

/**
 * Pill indicating a chart's level.
 */
export default class LevelPill extends React.Component<LevelPillProps> {
  render() {
    const { className, difficulty, level, style } = this.props

    const rootClassName = cx(
      className,
      styles.LevelPill,
      styles[difficulty],
      styles[style],
    )

    return (
      <span className={rootClassName}>
        {style === "full" ? getFullDifficultyName(difficulty) : difficulty}
        &nbsp;
        {level}
      </span>
    )
  }
}
