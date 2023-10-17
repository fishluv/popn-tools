import cx from "classnames"
import React from "react"
import styles from "./FolderPill.module.scss"
import Folder from "../models/Folder"

interface FolderPillProps {
  extraClass?: string
  folder: Folder
  style: "full" | "compact"
}

/**
 * Pill indicating a song's folder (e.g. usaneko, cs, etc.)
 */
export default class FolderPill extends React.Component<FolderPillProps> {
  render() {
    const { extraClass, folder, style } = this.props

    const folderClass = /^\d/.test(folder.norm)
      ? `ac${folder.norm}`
      : folder.norm
    const rootClassName = cx(
      extraClass,
      styles.FolderPill,
      styles[folderClass],
      {
        [styles.compact]: style === "compact",
      },
    )

    return (
      <span className={rootClassName}>
        {style === "compact" ? folder.short() : folder.long()}
      </span>
    )
  }
}
