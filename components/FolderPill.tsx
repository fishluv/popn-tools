import cx from "classnames"
import React from "react"
import styles from "./FolderPill.module.scss"

interface FolderPillProps {
  extraClass?: string
  songFolder: string
}

/**
 * Pill indicating a song's folder (e.g. usaneko, cs, etc.)
 */
export default class FolderPill extends React.Component<FolderPillProps> {
  getFolderDisplayName() {
    const { songFolder } = this.props

    switch (songFolder) {
      case "27":
        return "ul"
      case "26":
        return "kr"
      case "25":
        return "pe"
      case "24":
        return "usa"
      case "23":
        return "ecl"
      case "22":
        return "lap"
      case "21":
        return "sp"
      case "20":
        return "fan"
      case "19":
        return "ts"
      case "18":
        return "sr"
      case "17":
        return "mov"
      case "16":
        return "par"
      case "15":
        return "adv"
      case "14":
        return "fev"
      case "13":
        return "car"
      case "12":
        return "iro"
    }

    if (/^\d+/.test(songFolder)) {
      return Number(songFolder).toString()
    } else {
      return songFolder
    }
  }

  render() {
    const { extraClass, songFolder } = this.props

    const folderClass = /^\d/.test(songFolder) ? `ac${songFolder}` : songFolder
    const rootClassName = cx(
      extraClass,
      styles.FolderPill,
      styles[folderClass],
      styles.compact,
    )

    return <span className={rootClassName}>{this.getFolderDisplayName()}</span>
  }
}
