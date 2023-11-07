import cx from "classnames"
import React from "react"
import styles from "./SongChartDetails.module.scss"
import FolderPill from "../FolderPill"
import Song from "../../models/Song"
import SongBanner from "../SongBanner"
import SongLevelPills from "../SongLevelPills"
import Chart from "../../models/Chart"
import LevelPill from "../LevelPill"

function Detail({
  className,
  field,
  value,
  children,
}: {
  className?: string
  field: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cx(className, styles.Detail)}>
      <span className={styles.field}>{field}</span>
      <span className={styles.value}>
        {value}
        {children}
      </span>
    </div>
  )
}

function areEquivalent(a: string, b: string) {
  function norm(s: string) {
    return s.toLowerCase().replaceAll("？", "?").replaceAll("！", "!")
  }
  return norm(a).includes(norm(b)) || norm(b).includes(norm(a))
}

function getMinorTitleDisplay({ remywikiTitle, titleSortChar }: Song) {
  return (
    <Detail
      className={styles.minor}
      field=""
      value={`${maybeDisplaySortChar(
        titleSortChar,
        remywikiTitle,
      )}${remywikiTitle}`}
    />
  )
}

function getMinorGenreDisplay({ genre, genreSortChar }: Song) {
  return (
    <Detail
      className={styles.minor}
      field=""
      value={`${maybeDisplaySortChar(genreSortChar, genre)}${genre}`}
    />
  )
}

// https://stackoverflow.com/a/20488304
function toAscii(fw: string) {
  return fw.replace(/[！-～]/g, (ch: string) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  )
}

function maybeDisplaySortChar(
  titleOrGenreSortChar: string,
  titleOrGenre: string,
) {
  if (
    toAscii(titleOrGenreSortChar).toLowerCase() ===
    titleOrGenre.charAt(0).toLowerCase()
  ) {
    return ""
  } else {
    return `[${titleOrGenreSortChar}] `
  }
}

export default function SongChartDetails({
  song,
  chart,
}: {
  song?: Song
  chart?: Chart
}) {
  if (!song && !chart) {
    throw new Error("must specify song or chart")
  }

  const songToUse = (song || chart!.song)!

  const {
    id: songId,
    title,
    genre,
    genreRomanTrans,
    remywikiTitle,
    artist,
    folder,
    remywikiUrlPath,
    labels,
  } = songToUse
  const maybeUpperSuffix = labels.includes("upper") ? " (UPPER)" : ""

  return (
    <div className={styles.SongChartDetails}>
      <SongBanner className={styles.banner} songId={songId} />
      {chart && (
        <div className={styles.chartLevelPillContainer}>
          <LevelPill
            difficulty={chart.difficulty}
            level={chart.level}
            style="full"
          />
        </div>
      )}

      {areEquivalent(title, genre) ? (
        <>
          <Detail
            className={styles.title}
            field="title/genre"
            value={`${title}${maybeUpperSuffix}`}
          />
          {!areEquivalent(title, remywikiTitle) &&
            getMinorTitleDisplay(songToUse)}
        </>
      ) : (
        <>
          <Detail
            className={styles.title}
            field="title"
            value={`${title}${maybeUpperSuffix}`}
          />
          {!areEquivalent(title, remywikiTitle) &&
            getMinorTitleDisplay(songToUse)}
          <Detail
            className={styles.genre}
            field="genre"
            value={genreRomanTrans}
          />
          {getMinorGenreDisplay(songToUse)}
        </>
      )}

      <Detail field="artist" value={artist} />

      <Detail field="from">
        <FolderPill folder={folder} style="full" />
      </Detail>

      {!chart && (
        <Detail field="charts">
          <SongLevelPills
            pillClassName={styles.levelPill}
            song={songToUse}
            style="comfortable"
          />
        </Detail>
      )}

      <Detail field="links">
        <a href={`https://remywiki.com/${remywikiUrlPath}`} target="_blank">
          RemyWiki
        </a>
      </Detail>
    </div>
  )
}
