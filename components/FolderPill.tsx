import cx from "classnames"
import React from "react"
import styles from "./FolderPill.module.scss"
import Folder from "../models/Folder"

interface FolderPillProps {
  className?: string
  folder: Folder
  pillStyle: "full" | "compact"
  labelStyle: "full" | "compact"
}

/**
 * Pill indicating a song's folder (e.g. usaneko, cs, etc.)
 */
export default class FolderPill extends React.Component<FolderPillProps> {
  render() {
    const { className, folder, pillStyle, labelStyle } = this.props

    const folderClass = /^\d/.test(folder.norm)
      ? `ac${folder.norm}`
      : folder.norm
    const rootClassName = cx(
      className,
      styles.FolderPill,
      styles[folderClass],
      styles[pillStyle],
    )

    return (
      <span className={rootClassName}>
        {labelStyle === "compact" ? folder.short() : folder.long()}
      </span>
    )
  }
}
