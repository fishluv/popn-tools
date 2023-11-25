import cx from "classnames"
import React from "react"
import styles from "./LevelPill.module.scss"

interface LevelPillProps {
  className?: string
  difficulty: "e" | "n" | "h" | "ex"
  level: number
  pillStyle: "full" | "compact"
  labelStyle: "full" | "compact"
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
    const { className, difficulty, level, pillStyle, labelStyle } = this.props

    const rootClassName = cx(
      className,
      styles.LevelPill,
      styles[difficulty],
      styles[pillStyle],
    )

    return (
      <span className={rootClassName}>
        {labelStyle === "full" ? getFullDifficultyName(difficulty) : difficulty}
        &nbsp;
        {level}
      </span>
    )
  }
}
