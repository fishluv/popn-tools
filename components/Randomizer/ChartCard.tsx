import cx from "classnames"
import React from "react"
import { ChartDisplayOptions } from "../../lib/randomizer/ChartDisplay"
import styles from "./ChartCard.module.scss"
import { Chart, VersionFolder, BemaniFolder } from "popn-db-js"
import FolderPill from "../common/FolderPill"
import { BsStopwatch } from "react-icons/bs"
import { FaRegStar as FaStar } from "react-icons/fa"
import { LiaDrumSolid } from "react-icons/lia"
import { LuMountain } from "react-icons/lu"
import { IoMusicalNotesOutline } from "react-icons/io5"

// https://stackoverflow.com/a/20488304
function toAscii(fw: string) {
  return fw.replace(/[！-～]/g, (ch: string) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  )
}

function getSortChar(titleOrGenre: string, sortChar: string) {
  if (
    toAscii(titleOrGenre.charAt(0)).toLowerCase() !==
    toAscii(sortChar).toLowerCase()
  ) {
    return sortChar
  } else {
    return null
  }
}

type CardState = "default" | "vetoed" | "protected"

interface ChartCardProps {
  extraClass?: string
  chartData: Chart
  chartDisplayOptions: ChartDisplayOptions
  showSranLevel: boolean
}

interface ChartCardState {
  cardState: CardState
}

/**
 * Chart info
 */
export default class ChartCard extends React.Component<
  ChartCardProps,
  ChartCardState
> {
  constructor(props: ChartCardProps) {
    super(props)
    this.state = {
      cardState: "default",
    }
  }

  onClick = () => {
    const { chartDisplayOptions: { displayStyle } } = this.props
    this.setState((prevState) => {
      if (displayStyle === "compact") {
        return { cardState: prevState.cardState === "vetoed" ? "default" : "vetoed" }
      }
      const cycle: Record<CardState, CardState> = {
        default: "vetoed",
        vetoed: "protected",
        protected: "default",
      }
      return { cardState: cycle[prevState.cardState] }
    })
  }

  renderDiffLevel() {
    const {
      chartData: { difficulty, level },
      chartDisplayOptions: { displayStyle },
    } = this.props

    const className = cx(styles.diffLevel, styles[difficulty], {
      [styles.compact]: displayStyle === "compact",
    })

    return (
      <span className={className}>
        {difficulty}&nbsp;{level}
      </span>
    )
  }

  renderSranLevel() {
    const {
      chartData: { sranLevel },
      chartDisplayOptions: { displayStyle },
      showSranLevel,
    } = this.props

    if (!showSranLevel) {
      return null
    }

    const className = cx(styles.sranLevel, {
      [styles.compact]: displayStyle === "compact",
    })

    return <span className={className}>S乱&nbsp;{sranLevel ?? "—"}</span>
  }

  renderTitleGenre() {
    const { showSranLevel } = this.props

    const sortChar = this.getTitleOrGenreSortChar()

    const className = cx(styles.titleGenre, {
      [styles.withSranLevel]: showSranLevel,
    })

    return (
      <span className={className}>
        {sortChar && `(${sortChar}) `}
        {this.getDisplayTitleOrGenre()}
      </span>
    )
  }

  getTitleOrGenreSortChar = () => {
    const {
      chartDisplayOptions: { preferGenre },
      chartData: { genre, fwGenre, title, fwTitle },
    } = this.props

    if (preferGenre) {
      return getSortChar(genre, fwGenre[0])
    } else {
      return getSortChar(title, fwTitle[0])
    }
  }

  getDisplayTitleOrGenre() {
    const {
      chartDisplayOptions: { preferGenre },
      chartData: { title, genre, songLabels },
    } = this.props

    const titleOrGenre = preferGenre ? genre : title

    const isUpper = songLabels.includes("upper")
    const maybeUpperSuffix = isUpper ? " (UPPER)" : ""

    return `${titleOrGenre}${maybeUpperSuffix}`
  }

  getBannerBgImageStyle() {
    const {
      chartDisplayOptions: { assetsUrl },
      chartData: { songId },
    } = this.props

    const urlWithoutSlash = assetsUrl.replace(/\/$/, "")
    const paddedId = `000${songId}`.slice(-4)
    const bannerUrl = `${urlWithoutSlash}/kc_${paddedId}.png`
    return {
      backgroundImage: `url("${bannerUrl}")`,
    }
  }

  getBannerImage = (width: number, height: number) => {
    const {
      chartDisplayOptions: { assetsUrl },
      chartData: { songId, title },
    } = this.props

    const urlWithoutSlash = assetsUrl.replace(/\/$/, "")
    const paddedId = `000${songId}`.slice(-4)
    const bannerUrl = `${urlWithoutSlash}/kc_${paddedId}.png`

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={styles.bannerImage}
        src={bannerUrl}
        alt={`Banner for ${title}`}
        width={width}
        height={height}
        loading="lazy"
      />
    )
  }

  getFolderPill = (pillStyle: "normal" | "compact") => {
    const {
      chartData: { folders },
    } = this.props

    let songFolderToDisplay: VersionFolder | BemaniFolder | null
    if (folders.length) {
      songFolderToDisplay = folders[0] as VersionFolder | BemaniFolder
    } else {
      songFolderToDisplay = null
    }

    return (
      <FolderPill
        className={styles.folderPill}
        folder={songFolderToDisplay}
        pillStyle={pillStyle === "normal" ? "full" : "compact"}
        labelStyle={pillStyle === "normal" ? "full" : "compact"}
      />
    )
  }

  formatDuration = () => {
    const {
      chartData: { duration },
    } = this.props

    if (duration === null) {
      return "?"
    }

    const min = Math.floor(duration / 60)
    const sec = duration % 60
    return `${min}:${String(sec).padStart(2, "0")}`
  }

  formatRating = () => {
    const {
      chartData: { rating },
    } = this.props

    if (rating === null) {
      return "?"
    }
    if (Number(rating) === -1) {
      return "-1.0"
    }
    if (Number(rating) === 0) {
      return "0.0"
    }
    if (Number(rating) === 1) {
      return "+1.0"
    }
    if (Number(rating) > 0) {
      return `+${rating}`
    }
    // else < 0
    return rating
  }

  renderNormal() {
    const {
      extraClass,
      chartData: { difficulty, bpm, notes, holdNotes },
    } = this.props

    const { cardState } = this.state

    const diffStyle = styles[difficulty]

    const rootClassName = cx(
      extraClass,
      styles.ChartCard,
      styles.normal,
      diffStyle,
      {
        [styles.vetoed]: cardState === "vetoed",
        [styles.protected]: cardState === "protected",
      },
    )

    return (
      <div className={rootClassName} onClick={this.onClick}>
        <div className={cx(diffStyle, styles.topInfoContainer)}>
          <span className={cx(styles.topInfo, diffStyle)}>
            {this.renderDiffLevel()}
            {this.renderSranLevel()}
            {this.renderTitleGenre()}
          </span>
        </div>

        <div className={cx(styles.bottomContainer, diffStyle)}>
          <div className={styles.bannerContainer}>
            {this.getBannerImage(290, 72)}
          </div>

          {this.getFolderPill("normal")}
        </div>

        <div className={cx(styles.details, diffStyle)}>
          <span className={styles.item}>
            <LiaDrumSolid size="1rem" />
            <span>{bpm || "?"}</span>
          </span>

          <span className={styles.item}>
            <BsStopwatch size="0.875rem" />
            <span>{this.formatDuration()}</span>
          </span>

          <span className={styles.item}>
            <IoMusicalNotesOutline size="0.875rem" />
            <span>{notes || "?"}</span>
            {(holdNotes ?? 0) > 0 && <span className={styles.holdsPill}>L</span>}
          </span>

          <span className={styles.item}>
            <LuMountain size="0.875rem" />
            <span>{this.formatRating()}</span>
          </span>
        </div>

        {cardState === "protected" && (
          <FaStar className={cx(styles.protectedStar, diffStyle)} size="2.5rem" />
        )}
      </div>
    )
  }

  renderCompact() {
    const {
      extraClass,
      chartData: { difficulty },
    } = this.props
    const { cardState } = this.state

    const diffStyle = styles[difficulty]

    const rootClass = cx(
      extraClass,
      styles.ChartCard,
      styles.compact,
      diffStyle,
    )

    const bannerClass = cx(styles.banner, {
      [styles.vetoed]: cardState === "vetoed",
    })

    return (
      <div className={rootClass} onClick={this.onClick}>
        {this.renderTitleGenre()}

        <div className={bannerClass}>{this.getBannerImage(160, 40)}</div>

        <div className={cx(styles.diffStripe, diffStyle)} />

        <div className={styles.levels}>
          {this.renderDiffLevel()}
          {this.renderSranLevel()}
        </div>

        {this.getFolderPill("compact")}
      </div>
    )
  }

  render() {
    const {
      chartDisplayOptions: { displayStyle },
    } = this.props

    if (displayStyle === "normal") {
      return this.renderNormal()
    } else {
      return this.renderCompact()
    }
  }
}
