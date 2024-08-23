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

function TimingStep({
  className,
  timingStep,
}: {
  className?: string
  timingStep: number[]
}) {
  const validVals = timingStep.filter((val) => val >= 100 && val <= 160)
  if (validVals.length !== 6) {
    return (
      <div className={cx(className, styles.TimingStep)}>
        {validVals.join("/")}
      </div>
    )
  }

  const isStandard = JSON.stringify(timingStep) === "[118,122,126,132,136,140]"

  const [badStart, goodStart, greatStart, greatEnd, goodEnd, badEnd] =
    timingStep
  const [coolStart, coolEnd] = [127.8, 130.2] // Same in every chart.
  const earlyBadSize = goodStart - badStart
  const earlyGoodSize = greatStart - goodStart
  // Some great windows are eclipsed by the cool window.
  const earlyGreatSize = Math.max(0, coolStart - greatStart)
  const coolSize = coolEnd - coolStart
  const lateGreatSize = Math.max(0, greatEnd - coolEnd)
  const lateGoodSize = goodEnd - greatEnd
  const lateBadSize = badEnd - goodEnd

  function stretch(val: number) {
    return val * 8
  }

  const earlyBadStyle: CSSProperties = {
    left: stretch(badStart - 100),
    width: stretch(earlyBadSize),
  }
  const earlyGoodStyle: CSSProperties = {
    left: stretch(goodStart - 100),
    width: stretch(earlyGoodSize),
  }
  // Round these up since they're usually floats
  // and without rounding there are subtle white gaps.
  const earlyGreatStyle: CSSProperties = {
    left: stretch(greatStart - 100),
    width: Math.ceil(stretch(earlyGreatSize)),
  }
  const coolStyle: CSSProperties = {
    left: stretch(coolStart - 100),
    width: Math.ceil(stretch(coolSize)),
  }
  const lateGreatStyle: CSSProperties = {
    left: stretch(coolEnd - 100),
    width: Math.ceil(stretch(lateGreatSize)),
  }
  const lateGoodStyle: CSSProperties = {
    left: stretch(greatEnd - 100),
    width: stretch(lateGoodSize),
  }
  const lateBadStyle: CSSProperties = {
    left: stretch(goodEnd - 100),
    width: stretch(lateBadSize),
  }

  const info = [
    isStandard ? "Standard timing" : "Nonstandard timing",
    timingStep.join("/"),
    `Early bad window: ${earlyBadSize} frames (${Math.round(
      earlyBadSize * 16.6,
    )} ms)`,
    `Early good window: ${earlyGoodSize} frames (${Math.round(
      earlyGoodSize * 16.6,
    )} ms)`,
    `Early great window: ${earlyGreatSize.toFixed(1)} frames (${Math.round(
      earlyGreatSize * 16.6,
    )} ms)`,
    `Cool window: ${coolSize.toFixed(1)} frames (${Math.round(
      coolSize * 16.6,
    )} ms)`,
    `Late great window: ${lateGreatSize.toFixed(1)} frames (${Math.round(
      lateGreatSize * 16.6,
    )} ms)`,
    `Late good window: ${lateGoodSize} frames (${Math.round(
      lateGoodSize * 16.6,
    )} ms)`,
    `Late bad window: ${lateBadSize} frames (${Math.round(
      lateBadSize * 16.6,
    )} ms)`,
  ].join("\n")

  return (
    <div className={cx(className, styles.TimingStep)} title={info}>
      {/*
        Bad and good windows are always ints.
        Great and cool windows are always floats.
      */}
      <div className={styles.bad} style={earlyBadStyle} title="sup">
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
        {earlyGreatSize.toFixed(1)}
      </div>
      <div className={styles.great} style={lateGreatStyle}>
        {lateGreatSize.toFixed(1)}
      </div>
      <div className={styles.cool} style={coolStyle}>
        {coolSize.toFixed(1)}
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

function parseExtraOptions(extraOptionsStr: string) {
  const extraOptions: Record<string, boolean> = {}

  extraOptionsStr.split(",").forEach((opt) => {
    if (opt.trim()) {
      extraOptions[opt.trim()] = true
    }
  })

  return extraOptions
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

  const [extraOptionsStr] = useLocalStorage("extraOptions", "")
  const extraOptions = parseExtraOptions(extraOptionsStr)

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
    folder,
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
            <Detail
              className={styles.minor}
              field=""
              value={chart.bpmSteps.join(" → ")}
            />
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

          {extraOptions["timing"] &&
            chart.timingSteps &&
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

          {extraOptions["timing"] &&
            chart.timing &&
            chart.timing !== "standard" && (
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
