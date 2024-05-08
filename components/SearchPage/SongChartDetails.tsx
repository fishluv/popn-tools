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
import useLocalStorage from "../../lib/useLocalStorage"

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
  if (
    toAscii(sortChar).toLowerCase() === toAscii(value.charAt(0)).toLowerCase()
  ) {
    return ""
  } else {
    return `[${sortChar}] `
  }
}

function formatDuration(duration: number) {
  const min = Math.floor(duration / 60)
  const sec = duration % 60
  return `${min}:${String(sec).padStart(2, "0")}`
}

function parseExtraOptions(extraOptionsStr: string) {
  const extraOptions: Record<string, boolean> = {}

  extraOptionsStr.split(",").forEach((opt) => {
    if (opt.trim()) {
      extraOptions[opt.trim()] = true
    }
  })

  return extraOptions
}

function diffToEagleFlowerPathPart(diff: "e" | "n" | "h" | "ex") {
  return ["e", "n", "h", "ex"].indexOf(diff)
}

function diffToTablanPathPart(diff: "e" | "n" | "h" | "ex") {
  return {
    e: "Easy",
    n: "Normal",
    h: "Hyper",
    ex: "EX",
  }[diff]
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

  const [extraOptionsStr] = useLocalStorage("extraOptions", "")
  const extraOptions = parseExtraOptions(extraOptionsStr)

  const songToUse = (song || chart!.song)!

  const {
    id: songId,
    title,
    titleSortChar,
    genre,
    genreRomanTrans,
    genreSortChar,
    remywikiTitle,
    artist,
    character1,
    character2,
    debut,
    folder,
    remywikiUrlPath,
    remywikiChara,
    labels,
  } = songToUse
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

      {labels.includes("omnimix") && (
        <p className={styles.omniNote}>This song is no longer playable.</p>
      )}

      <SongBanner
        className={styles.banner}
        song={songToUse}
        width={280}
        height={70}
      />

      {chart && (
        <div className={styles.chartLevelPillContainer}>
          <LevelPill
            difficulty={chart.difficulty}
            level={chart.level}
            pillStyle="full"
            labelStyle="full"
          />
          {!!chart.holdNotes && <span className={styles.holdsPill}>long</span>}
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
        <div>
          {character1 && (
            <CharacterIcon
              className={styles.CharacterIcon}
              character={character1}
              songFolder={folder}
            />
          )}
          {/* forget about chara2 icon bc it's almost always the same as chara1
          and there's no way to tell when it's different here */}
        </div>
        <span>{remywikiChara}</span>
      </Detail>

      {/* When remywiki name is different from display name, show display name on second line. */}
      {/* MZD has a lot of special display names. Ignore them. */}
      {character1 &&
        remywikiChara !== character1.displayName &&
        remywikiChara !== "MZD" && (
          <Detail
            className={styles.minor}
            field=""
            value={`${maybeDisplaySortChar(
              character1.sortName[0],
              character1.displayName,
            )}${toAscii(character1.displayName)}`}
          />
        )}
      {character2 &&
        character2.displayName !== character1?.displayName &&
        remywikiChara !== character2.displayName &&
        remywikiChara !== "MZD" && (
          <Detail
            className={styles.minor}
            field=""
            value={`${maybeDisplaySortChar(
              character2.sortName[0],
              character2.displayName,
            )}${toAscii(character2.displayName)}`}
          />
        )}

      {debut === folder ? (
        <Detail field="debut/folder">
          <FolderPill folder={debut} pillStyle="full" labelStyle="full" />
        </Detail>
      ) : (
        <>
          <Detail field="debut">
            <FolderPill folder={debut} pillStyle="full" labelStyle="full" />
          </Detail>

          <Detail field="folder">
            <FolderPill folder={folder} pillStyle="full" labelStyle="full" />
          </Detail>
        </>
      )}

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
          <Detail
            field="duration"
            value={chart.duration ? formatDuration(chart.duration) : "?"}
          />
          <Detail field="notes">
            {chart.notes ? (
              <>
                <span>{chart.notes}</span>
                <span>{!!chart.holdNotes && `(${chart.holdNotes} long)`}</span>
              </>
            ) : (
              "?"
            )}
          </Detail>
          {chart.jpRating && (
            <Detail field="jp rating" value={chart.jpRating} />
          )}
          {chart.sranLevel && (
            <Detail field="sran level" value={chart.sranLevel.display()} />
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

        {extraOptions["eagle"] && (
          <>
            <br />
            <a
              href={`https://eagle.ac/game/pnm/music/27/${songId}/${diffToEagleFlowerPathPart(
                chart?.difficulty || "e",
              )}`}
              target="_blank"
            >
              Eagle
            </a>
          </>
        )}

        {extraOptions["flower"] && (
          <>
            <br />
            <a
              href={`https://projectflower.eu/game/pnm/music/27/${songId}/${diffToEagleFlowerPathPart(
                chart?.difficulty || "e",
              )}`}
              target="_blank"
            >
              Flower
            </a>
          </>
        )}

        {extraOptions["tablan"] && (
          <>
            <br />
            <a
              href={`https://tablanbass.org/pnm/topscores/${songId}#${diffToTablanPathPart(
                chart?.difficulty || "e",
              )}`}
              target="_blank"
            >
              Tabla&apos;n Bass Remix
            </a>
          </>
        )}
      </Detail>
    </div>
  )
}
