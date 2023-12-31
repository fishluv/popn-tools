import cx from "classnames"
import React from "react"
import styles from "./SongChartDetails.module.scss"
import FolderPill from "../common/FolderPill"
import Song from "../../models/Song"
import SongBanner from "../common/SongBanner"
import SongLevelPills from "../common/SongLevelPills"
import Chart from "../../models/Chart"
import LevelPill from "../common/LevelPill"
import CharacterIcon from "../common/CharacterIcon"
import { BsMusicNoteBeamed } from "react-icons/bs"
import { CgNotes } from "react-icons/cg"

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

// https://stackoverflow.com/a/20488304
function toAscii(fw: string) {
  return fw.replace(/[！-～]/g, (ch: string) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  )
}

function maybeDisplaySortChar(sortChar: string, value: string) {
  if (toAscii(sortChar).toLowerCase() === value.charAt(0).toLowerCase()) {
    return ""
  } else {
    return `[${sortChar}] `
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
    title,
    titleSortChar,
    genre,
    genreRomanTrans,
    genreSortChar,
    remywikiTitle,
    artist,
    character1,
    folder,
    remywikiUrlPath,
    remywikiChara,
    labels,
  } = songToUse
  const { sortName: chara1SortName, displayName: chara1DisplayName } =
    character1
  const maybeUpperSuffix = labels.includes("upper") ? " (UPPER)" : ""

  return (
    <div className={styles.SongChartDetails}>
      <p className={cx(styles.header, song ? styles.song : styles.chart)}>
        {song ? (
          <>
            <BsMusicNoteBeamed /> <span>song</span>
          </>
        ) : (
          <>
            <CgNotes /> <span>chart</span>
          </>
        )}
      </p>

      <SongBanner className={styles.banner} song={songToUse} />

      {chart && (
        <div className={styles.chartLevelPillContainer}>
          <LevelPill
            difficulty={chart.difficulty}
            level={chart.level}
            pillStyle="full"
            labelStyle="full"
          />
          {chart.hasHolds && <span className={styles.holdsPill}>long</span>}
        </div>
      )}

      {areEquivalent(title, genre) ? (
        <>
          <Detail
            className={styles.title}
            field="title/genre"
            value={`${title}${maybeUpperSuffix}`}
          />
          {!areEquivalent(title, remywikiTitle) && (
            <Detail
              className={styles.minor}
              field=""
              value={`${maybeDisplaySortChar(
                titleSortChar,
                remywikiTitle,
              )}${remywikiTitle}`}
            />
          )}
        </>
      ) : (
        <>
          <Detail
            className={styles.title}
            field="title"
            value={`${title}${maybeUpperSuffix}`}
          />
          {!areEquivalent(title, remywikiTitle) && (
            <Detail
              className={styles.minor}
              field=""
              value={`${maybeDisplaySortChar(
                titleSortChar,
                remywikiTitle,
              )}${remywikiTitle}`}
            />
          )}
          <Detail
            className={styles.genre}
            field="genre"
            value={genreRomanTrans}
          />
          <Detail
            className={styles.minor}
            field=""
            value={`${maybeDisplaySortChar(genreSortChar, genre)}${genre}`}
          />
        </>
      )}

      <Detail field="artist" value={artist} />

      <Detail className={styles.chara} field="chara">
        <CharacterIcon
          className={styles.CharacterIcon}
          character={character1}
          songFolder={folder}
        />
        &nbsp;
        <span>{remywikiChara}</span>
      </Detail>

      {/* When remywiki name is different from display name, show display name on second line. */}
      {/* MZD has a lot of special display names. Ignore them. */}
      {remywikiChara !== chara1DisplayName && remywikiChara !== "MZD" && (
        <Detail
          className={styles.minor}
          field=""
          value={`${maybeDisplaySortChar(
            chara1SortName[0],
            chara1DisplayName,
          )}${chara1DisplayName}`}
        />
      )}

      <Detail field="from">
        <FolderPill folder={folder} pillStyle="full" labelStyle="full" />
      </Detail>

      {!chart && (
        <Detail field="charts">
          <SongLevelPills
            pillClassName={styles.levelPill}
            song={songToUse}
            pillStyle="full"
            labelStyle="compact"
          />
        </Detail>
      )}

      {chart && (
        <>
          <Detail field="bpm" value={chart.bpm || "?"} />
          <Detail field="duration" value={chart.duration || "?"} />
          <Detail field="notes" value={chart.notes?.toString() || "?"} />
          {chart.jpRating && (
            <Detail field="jp rating" value={chart.jpRating} />
          )}
          {chart.sranLevel && (
            <Detail field="sran level" value={chart.sranLevel} />
          )}
        </>
      )}

      <Detail className={styles.links} field="links">
        <a href={`https://remywiki.com/${remywikiUrlPath}`} target="_blank">
          RemyWiki
        </a>
        {chart?.jkwikiPagePath && (
          <>
            <br />
            <a
              href={`https://popn.wiki/%E9%9B%A3%E6%98%93%E5%BA%A6%E8%A1%A8/${chart.jkwikiPagePath}`}
              target="_blank"
            >
              popn.wiki
            </a>
          </>
        )}
      </Detail>
    </div>
  )
}
