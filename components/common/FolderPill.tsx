import cx from "classnames"
import React from "react"
import styles from "./FolderPill.module.scss"
import VersionFolder from "../../models/VersionFolder"
import OtherFolder from "../../models/OtherFolder"

interface FolderPillProps {
  className?: string
  folder: VersionFolder | OtherFolder | null
  pillStyle: "full" | "compact"
  labelStyle: "full" | "compact"
}

/**
 * Pill indicating a song's folder (e.g. usaneko, cs, etc.)
 */
export default class FolderPill extends React.Component<FolderPillProps> {
  getFolderDisplayName() {
    const { folder, labelStyle } = this.props

    if (folder === null) {
      return "—"
    }

    if (labelStyle === "full") {
      switch (folder) {
        case "27":
          return "unilab"
        case "26":
          return "kaimei riddles"
        case "25":
          return "peace"
        case "24":
          return "usaneko"
        case "23":
          return "eclale"
        case "22":
          return "lapistoria"
        case "21":
          return "sunny park"
        case "20":
          return "fantasia"
        case "19":
          return "tune street"
        case "18":
          return "sengoku retsuden"
        case "17":
          return "the movie"
        case "16":
          return "party"
        case "15":
          return "adventure"
        case "14":
          return "fever"
        case "13":
          return "carnival"
        case "12":
          return "iroha"
      }
    } else {
      switch (folder) {
        case "bemani":
          return "bem"
        case "gitadora":
          return "gd"
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
    }

    if (/^\d+/.test(folder)) {
      return Number(folder).toString()
    } else {
      return folder
    }
  }

  render() {
    const { className, folder, pillStyle } = this.props

    let folderClass
    if (folder) {
      if (/^\d/.test(folder)) {
        folderClass = `ac${folder}`
      } else {
        folderClass = folder
      }
    } else {
      folderClass = "none"
    }

    const rootClassName = cx(
      className,
      styles.FolderPill,
      styles[folderClass],
      styles[pillStyle],
    )

    return <span className={rootClassName}>{this.getFolderDisplayName()}</span>
  }
}
