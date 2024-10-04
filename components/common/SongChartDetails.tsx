import cx from "classnames"
import React, { CSSProperties, useState } from "react"
import { BsMusicNoteBeamed } from "react-icons/bs"
import { CgNotes } from "react-icons/cg"
import { IoMdArrowRoundBack } from "react-icons/io"
import styles from "./SongChartDetails.module.scss"
import CharacterIcon from "./CharacterIcon"
import FolderPill from "./FolderPill"
import LevelPill from "./LevelPill"
import NoteIcon from "./NoteIcon"
import SongBanner from "./SongBanner"
import Chart from "../../models/Chart"
import Song from "../../models/Song"
import useExtraOptions from "../../lib/useExtraOptions"

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

function TimingStep({
  className,
  timingStep,
}: {
  className?: string
  timingStep: number[]
}) {
  if (timingStep.length !== 6) {
    return (
      <div className={cx(className, styles.TimingStep)}>
        {JSON.stringify(timingStep)}
      </div>
    )
  }

  const isStandard = JSON.stringify(timingStep) === "[118,122,126,132,136,140]"

  /**
   * 1 frame = 16.66 ms at 60 hz (or 16.68 ms at 59.97 hz)
   * But to simplify the math, Konami uses an approximated frame unit
   * where 1 approximate frame equals exactly 16 ms.
   * And then to compensate they enlarge the late side of the windows
   * by an 4 additional ms.
   * (Consequently, the late great window is slightly larger than
   * the early great window.)
   *
   * First, we convert approximate frames to ms.
   */
  let [badStart, goodStart, greatStart, greatEnd, goodEnd, badEnd] =
    timingStep.map((v, i) => (v - 129) * 16 + (i >= 3 ? 4 : 0))
  // Excluded from timing data because it's the same in every chart.
  const [coolStart, coolEnd] = [-20, 20]
  // Some great windows are eclipsed by the cool window (SPY H).
  // This clamping ensures no windows overlap (i.e. values monotonically increase).
  greatStart = Math.min(greatStart, coolStart)
  goodStart = Math.min(goodStart, greatStart)
  badStart = Math.min(badStart, goodStart)
  greatEnd = Math.max(greatEnd, coolEnd)
  goodEnd = Math.max(goodEnd, greatEnd)
  badEnd = Math.max(badEnd, goodEnd)
  /*
   * For standard timing, this conversion yields ms values of:
   *   early bad   -176
   *   early good  -112
   *   early great  -48
   *   early cool   -20
   *    late cool   +20
   *    late great  +52
   *    late good  +116
   *    late bad   +180
   *
   * The min and max approximate frame values are 104 and 154.
   * Thus the effective range for converted ms is -400 to +404.
   */
  // Now we can calculate the effective window sizes in ms.
  const earlyBadSize = goodStart - badStart
  const earlyGoodSize = greatStart - goodStart
  const earlyGreatSize = coolStart - greatStart
  const coolSize = coolEnd - coolStart
  const lateGreatSize = greatEnd - coolEnd
  const lateGoodSize = goodEnd - greatEnd
  const lateBadSize = badEnd - goodEnd

  function scale(val: number) {
    return val * 0.5
  }

  // Add 176 so that standard timing ends up with left = 0.
  const earlyBadStyle: CSSProperties = {
    left: scale(badStart + 176),
    width: scale(earlyBadSize),
  }
  const earlyGoodStyle: CSSProperties = {
    left: scale(goodStart + 176),
    width: scale(earlyGoodSize),
  }
  const earlyGreatStyle: CSSProperties = {
    left: scale(greatStart + 176),
    width: scale(earlyGreatSize),
  }
  const coolStyle: CSSProperties = {
    left: scale(coolStart + 176),
    width: scale(coolSize),
  }
  const lateGreatStyle: CSSProperties = {
    left: scale(coolEnd + 176),
    width: scale(lateGreatSize),
  }
  const lateGoodStyle: CSSProperties = {
    left: scale(greatEnd + 176),
    width: scale(lateGoodSize),
  }
  const lateBadStyle: CSSProperties = {
    left: scale(goodEnd + 176),
    width: scale(lateBadSize),
  }

  const info = [
    isStandard ? "Standard timing" : "Nonstandard timing",
    JSON.stringify(timingStep),
    `Early bad window: ${earlyBadSize} ms`,
    `Early good window: ${earlyGoodSize} ms`,
    `Early great window: ${earlyGreatSize} ms`,
    `Cool window: ${coolSize} ms`,
    `Late great window: ${lateGreatSize} ms`,
    `Late good window: ${lateGoodSize} ms`,
    `Late bad window: ${lateBadSize} ms`,
  ].join("\n")

  return (
    <div className={cx(className, styles.TimingStep)} title={info}>
      <div className={styles.bad} style={earlyBadStyle}>
        {earlyBadSize}
      </div>
      <div className={styles.bad} style={lateBadStyle}>
        {lateBadSize}
      </div>
      <div className={styles.good} style={earlyGoodStyle}>
        {earlyGoodSize}
      </div>
      <div className={styles.good} style={lateGoodStyle}>
        {lateGoodSize}
      </div>
      <div className={styles.great} style={earlyGreatStyle}>
        {earlyGreatSize}
      </div>
      <div className={styles.great} style={lateGreatStyle}>
        {lateGreatSize}
      </div>
      <div className={styles.cool} style={coolStyle}>
        {coolSize}
      </div>
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
    return `[${toAscii(sortChar)}] `
  }
}

function formatDuration(duration: number) {
  const min = Math.floor(duration / 60)
  const sec = duration % 60
  return `${min}:${String(sec).padStart(2, "0")}`
}

function diffToEagleFlowerPlifePathPart(diff: "e" | "n" | "h" | "ex") {
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
  className,
  song,
  chartToOpen,
  showHeader,
  showActions,
}: {
  className?: string
  song?: Song
  chartToOpen?: Chart
  showHeader: boolean
  showActions?: boolean
}) {
  const [chart, setChart] = useState<Chart | undefined>(chartToOpen)

  if (!song && !chart) {
    throw new Error("must specify song or chart")
  }

  const extraOptions = useExtraOptions()

  const songToUse = (song || chart!.song)!

  const {
    id: songId,
    title,
    sortTitle,
    genre,
    genreRomanTrans,
    sortGenre,
    remywikiTitle,
    artist,
    character1,
    character2,
    debut,
    folders,
    remywikiUrlPath,
    remywikiChara,
    labels: songLabels,
    slug,
    charts,
  } = songToUse
  const maybeUpperSuffix = songLabels.includes("upper") ? " (UPPER)" : ""

  return (
    <div className={cx(styles.SongChartDetails, className)}>
      {showHeader && (
        <p className={cx(styles.header, chart ? styles.chart : styles.song)}>
          {chart ? (
            <>
              <CgNotes /> <span>chart</span>
            </>
          ) : (
            <>
              <BsMusicNoteBeamed /> <span>song</span>
            </>
          )}
        </p>
      )}

      {songLabels.includes("omnimix") && (
        <p className={styles.omniNote}>This song is no longer playable.</p>
      )}

      {showActions && chart && (
        <div
          className={cx(
            styles.actions,
            song ? styles.spacebetween : styles.center,
          )}
        >
          {song && (
            <button onClick={() => setChart(undefined)}>
              <IoMdArrowRoundBack viewBox="0 8 512 512" size="1.25em" /> Back
            </button>
          )}

          <a
            className={styles.viewChartLink}
            href={`/chart/${slug}/${chart.difficulty}`}
            target="_blank"
          >
            <NoteIcon className={styles.NoteIcon} color="red" />
            View chart
          </a>
        </div>
      )}

      <div className={styles.bannerContainer}>
        <SongBanner
          className={styles.banner}
          songId={songId}
          songTitle={remywikiTitle}
          width={280}
          height={70}
        />

        {chart && (
          <>
            <div className={cx(styles.diffStripe, styles[chart.difficulty])} />

            <LevelPill
              className={styles.LevelPill}
              difficulty={chart.difficulty}
              level={chart.level}
              pillStyle="compact"
              labelStyle="full"
            />
          </>
        )}
      </div>

      {extraOptions["songid"] && (
        <Detail field="song id" value={String(songId)} />
      )}

      {/*
        1. title exactly equals genre (new songs): only show once

        no sort char, no remywiki title: airplane
        no sort char, yes remywiki title: hopes and dreams
        yes sort char, no remywiki title: iki
        yes sort char, yes remywiki title: soranaki
      */}
      {title === genre ? (
        <>
          <Detail
            className={styles.title}
            field="title/genre"
            value={`${maybeDisplaySortChar(sortTitle[0], title)}${toAscii(
              title,
            )}${maybeUpperSuffix}`}
          />
          {/* title contains non-roman characters */}
          {!areEquivalent(title, remywikiTitle) && (
            <Detail className={styles.minor} field="" value={remywikiTitle} />
          )}
        </>
      ) : (
        /*
          2. title != genre (most old songs): show both
        */
        <>
          <Detail
            className={styles.title}
            field="title"
            value={`${maybeDisplaySortChar(sortTitle[0], title)}${toAscii(
              title,
            )}${maybeUpperSuffix}`}
          />
          {/* title contains non-roman characters */}
          {!areEquivalent(title, remywikiTitle) && (
            <Detail className={styles.minor} field="" value={remywikiTitle} />
          )}

          {/* 
            no sort char, no romantrans: ddr
            no sort char, yes romantrans: spy
            yes sort char, no romantrans: (n/a - not known to happen)
            yes sort char, yes romantrans: ergosphere
          */}
          <Detail
            className={styles.genre}
            field="genre"
            value={`${maybeDisplaySortChar(sortGenre[0], genre)}${toAscii(
              genre,
            )}`}
          />
          {toAscii(genre) !== genreRomanTrans && (
            <Detail className={styles.minor} field="" value={genreRomanTrans} />
          )}
        </>
      )}

      <Detail field="artist" value={artist} />

      <Detail className={styles.chara} field="chara">
        <div>
          {character1 && (
            <CharacterIcon
              className={styles.CharacterIcon}
              character={character1}
              songFolder={folders[0] ?? null}
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

      <Detail field="debut">
        <FolderPill folder={debut} pillStyle="full" labelStyle="full" />
      </Detail>

      <Detail field="folders">
        {folders.map((folder, i) => (
          <FolderPill
            key={i}
            folder={folder}
            pillStyle="full"
            labelStyle="full"
          />
        ))}
      </Detail>

      {!chart && (
        <Detail className={styles.charts} field="charts">
          {[charts?.easy, charts?.normal, charts?.hyper, charts?.ex]
            .filter(Boolean)
            .map((chart, index) => (
              <div className={styles.chart} key={index}>
                <LevelPill
                  className={styles.diffLevelPill}
                  difficulty={chart!.difficulty}
                  level={chart!.level}
                  pillStyle="full"
                  labelStyle="compact"
                />
                <button onClick={() => setChart(chart!)}>See details</button>
              </div>
            ))}
        </Detail>
      )}

      {chart && (
        <>
          <Detail field="bpm" value={chart.bpm || "?"} />
          {chart.bpmSteps && chart.bpmSteps.length > 1 && (
            <>
              <Detail
                className={styles.minor}
                field=""
                value={chart.bpmSteps.join(" → ")}
              />
              <Detail className={cx(styles.minor, styles.primaryBpm)} field="">
                {"primary: "}
                {chart.primaryBpm}
                {chart.primaryBpmType === "plurality" && " (nonmajority)"}
              </Detail>
            </>
          )}

          <Detail
            field="duration"
            value={chart.duration ? formatDuration(chart.duration) : "?"}
          />

          <Detail field="notes">
            {chart.notes ? (
              <>
                <span>{chart.notes}</span>
                <span className={styles.holdNotes}>
                  {!!chart.holdNotes && `(${chart.holdNotes} long)`}
                </span>
              </>
            ) : (
              "?"
            )}
          </Detail>

          <Detail className={styles.timing} field="timing">
            {chart.timing ? (
              <span className={styles[chart.timing]}>{chart.timing}</span>
            ) : (
              <>{"?"}</>
            )}
          </Detail>

          {chart.timingSteps &&
            chart.timingSteps.length > 0 &&
            chart.timingSteps.map((step, idx) => (
              <Detail
                key={idx}
                field=""
                className={chart.timing === "standard" ? styles.minor : ""}
              >
                <TimingStep timingStep={step} />
              </Detail>
            ))}

          {chart.timing && chart.timing !== "standard" && (
            <>
              <Detail field="" value="reference: standard" />
              <Detail field="" className={styles.minor}>
                <TimingStep timingStep={[118, 122, 126, 132, 136, 140]} />
              </Detail>
            </>
          )}

          {chart.jpRating && (
            <Detail field="jp rating" value={chart.jpRating} />
          )}

          {chart.sranLevel && (
            <Detail field="sran level" value={chart.sranLevel.display()} />
          )}
        </>
      )}

      <Detail className={styles.links} field="links">
        {showActions && chart && (
          <>
            <a
              className={styles.viewChartLink}
              href={`/chart/${slug}/${chart.difficulty}`}
              target="_blank"
            >
              <NoteIcon className={styles.NoteIcon} color="red" />
              View chart
            </a>
            <br />
          </>
        )}

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
              href={`https://eagle.ac/game/pnm/music/27/${songId}/${diffToEagleFlowerPlifePathPart(
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
              href={`https://projectflower.eu/game/pnm/music/27/${songId}/${diffToEagleFlowerPlifePathPart(
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
              href={`https://tablanbass.net/pnm/topscores/${songId}#${diffToTablanPathPart(
                chart?.difficulty || "e",
              )}`}
              target="_blank"
            >
              {`Tabla'n Bass Remix`}
            </a>
          </>
        )}

        {extraOptions["plife"] && (
          <>
            <br />
            <a
              href={`https://programmedlife.org/en/game/pnm/music/${songId}/${diffToEagleFlowerPlifePathPart(
                chart?.difficulty || "e",
              )}`}
              target="_blank"
            >
              Programmed Life
            </a>
          </>
        )}
      </Detail>
    </div>
  )
}
