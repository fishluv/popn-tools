import cx from "classnames"
import toast from "react-hot-toast"
import { FaLink } from "react-icons/fa6"
import MeasureData from "../../models/MeasureData"
import styles from "./Measure.module.scss"
import Note, { NoteColor } from "./Note"
import HoldNote from "./HoldNote"
import { CSSProperties } from "react"

export type NoteSpacing = "veryslow" | "slow" | "default" | "fast" | "veryfast"

export function parseNoteSpacing(hs: string | null | undefined): NoteSpacing {
  switch (hs) {
    case "veryslow":
    case "slow":
    case "default":
    case "fast":
    case "veryfast":
      return hs
    default:
      return "default"
  }
}

export type NoteColoring = "normal" | "rhythm"

export function parseNoteColoring(
  noteColor: string | null | undefined,
): NoteColoring {
  switch (noteColor) {
    case "normal":
    case "rhythm":
      return noteColor
    default:
      return "normal"
  }
}

export interface DisplayOptions {
  noteSpacing: NoteSpacing
  bpmAgnostic: boolean
  noteColoring: NoteColoring
  chartEditingMode: boolean
}

const PIXELS_PER_MS_BY_SPACING: Record<NoteSpacing, number> = {
  veryslow: 0.1,
  slow: 0.15,
  default: 0.2,
  fast: 0.3,
  veryfast: 0.45,
}

function getNoteAreaHeight(
  measure: MeasureData,
  displayOptions: DisplayOptions,
) {
  const durByBpm = { [measure.startBpm]: 0 }
  let currBpm = measure.startBpm
  let currTs = measure.startTimestamp

  measure.rows.forEach((row) => {
    const nextTs = row.timestamp
    durByBpm[currBpm] += nextTs - currTs
    currTs = nextTs
    if (row.bpm !== null) {
      currBpm = row.bpm
    }
    if (!(currBpm in durByBpm)) {
      durByBpm[currBpm] = 0
    }
  })

  const endTs = measure.startTimestamp + measure.duration
  durByBpm[currBpm] += endTs - currTs

  let noteAreaHeight = 0
  Object.entries(durByBpm).forEach(([bpm, duration]) => {
    noteAreaHeight += msToPixels({
      ms: duration,
      bpm: Number(bpm),
      ...displayOptions,
    })
  })

  return noteAreaHeight
}

interface GuideLineData {
  type: "beat" | "half"
  y: number
  timestamp?: number
}

function getGuideLineDatas(
  measure: MeasureData,
  noteAreaHeight: number,
  displayOptions: DisplayOptions,
) {
  let prevY = noteAreaHeight - 1
  let prevTs = measure.startTimestamp
  let prevBpm = measure.startBpm
  let prevBeatY = prevY
  let prevBeatTs = prevTs

  const guideLineDatas: GuideLineData[] = []

  measure.rows.forEach(({ timestamp, measurebeatend, bpm }, index) => {
    const newTs = timestamp
    const newY = calculateNewY({
      prevY,
      prevBpm,
      prevTs,
      newTs,
      ...displayOptions,
    })

    // Ignore "m". We draw measure lines with a simple border.
    // Ignore "e". Not needed for now.
    if (measurebeatend === "b") {
      guideLineDatas.push({
        type: "beat",
        y: newY,
        timestamp: newTs,
      })

      if (index !== 0) {
        guideLineDatas.push({
          type: "half",
          y: (prevBeatY + newY) / 2.0,
          timestamp: Math.floor((prevBeatTs + newTs) / 2.0),
        })

        prevBeatY = newY
        prevBeatTs = newTs
      }
    }

    prevY = newY
    prevTs = newTs
    if (bpm !== null) {
      prevBpm = bpm
    }
  })

  const endTs = measure.startTimestamp + measure.duration
  const endY = calculateNewY({
    prevY,
    prevBpm,
    prevTs,
    newTs: endTs,
    ...displayOptions,
  })
  guideLineDatas.push({
    type: "half",
    y: (prevBeatY + endY) / 2.0,
    timestamp: Math.floor((prevBeatTs + endTs) / 2.0),
  })

  return guideLineDatas
}

function GuideLine({ type, y, timestamp }: GuideLineData) {
  const style = {
    top: y,
  }
  return (
    <div
      id={timestamp === undefined ? undefined : `line${timestamp}`}
      className={cx(styles.GuideLine, styles[type])}
      style={style}
    >
      <div className={styles.timestamp}>{timestamp}</div>
    </div>
  )
}

interface BpmEventData {
  type: "initial" | "increase" | "decrease"
  bpm: number
  y: number
}

function getBpmEventDatas(
  measure: MeasureData,
  noteAreaHeight: number,
  displayOptions: DisplayOptions,
) {
  let prevY = noteAreaHeight - 1
  let prevTs = measure.startTimestamp
  let prevBpm = measure.startBpm

  const bpmEventDatas: BpmEventData[] = []

  measure.rows.forEach(({ timestamp, bpm }) => {
    const newTs = timestamp
    const newY = calculateNewY({
      prevY,
      prevBpm,
      prevTs,
      newTs,
      ...displayOptions,
    })

    if (bpm !== null) {
      let type: "initial" | "increase" | "decrease"
      if (bpm === prevBpm) {
        type = "initial"
      } else if (bpm > prevBpm) {
        type = "increase"
      } else {
        type = "decrease"
      }
      // Sometimes charts have bpm events that don't change the bpm. Discard these.
      // E.g. Piano Kaijin EX measure 50.
      if (!(type === "initial" && measure.index !== 1)) {
        bpmEventDatas.push({
          type,
          bpm,
          y: newY,
        })
      }

      prevBpm = bpm
    }

    prevY = newY
    prevTs = newTs
  })

  return bpmEventDatas
}

function BpmEvent({ type, bpm, y }: BpmEventData) {
  const style = {
    top: y - 2,
  }
  let arrow
  if (type === "initial") {
    arrow = null
  } else if (type === "increase") {
    arrow = "▲"
  } else {
    arrow = "▼"
  }

  return (
    <div className={cx(styles.BpmEvent, styles[type])} style={style}>
      <div className={styles.line} />
      <div className={styles.bpm}>
        {arrow && <span className={styles.arrow}>{arrow}</span>}
        <span className={styles.bpmStr}>{`${bpm} bpm`}</span>
      </div>
    </div>
  )
}

interface TimingEventData {
  index: number
  y: number
}

function getTimingEventDatas(
  measure: MeasureData,
  noteAreaHeight: number,
  displayOptions: DisplayOptions,
) {
  let prevY = noteAreaHeight - 1
  let prevTs = measure.startTimestamp
  let prevBpm = measure.startBpm

  const timingEventDatas: TimingEventData[] = []

  measure.rows.forEach(({ timestamp, bpm, timing }) => {
    const newTs = timestamp
    const newY = calculateNewY({
      prevY,
      prevBpm,
      prevTs,
      newTs,
      ...displayOptions,
    })

    if (timing !== null && timing !== undefined) {
      timingEventDatas.push({
        index: timing,
        y: newY,
      })
    }

    prevY = newY
    prevTs = newTs
    if (bpm !== null) {
      prevBpm = bpm
    }
  })

  return timingEventDatas
}

function TimingEvent({ index, y }: TimingEventData) {
  const style = {
    top: y,
  }
  return (
    <div
      className={cx(
        styles.TimingEvent,
        index > 0 ? styles.change : styles.initial,
      )}
      style={style}
    >
      <div className={styles.bar} />
      <div className={styles.connector} />
      <span className={styles.timing}>{`timing (${index + 1})`}</span>
    </div>
  )
}

type LaneOrd = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type Rhythm = "4th" | "8th" | "12th" | "16th" | "24th" | "32nd" | "other"
interface NoteData {
  lane: LaneOrd
  y: number
  rhythm: Rhythm
}

function noteTimestampToRhythm(
  noteTs: number,
  prevBeatTs: number,
  bpm: number,
): Rhythm {
  const durationAfterBeat = noteTs - prevBeatTs
  // This doesn't work great when the bpm changes mid-beat lol.
  const beatDuration = 60000 / bpm
  const fraction = durationAfterBeat / beatDuration
  if (durationAfterBeat === 0) {
    return "4th"
  } else if (numbersRoughlyEqual(fraction, 1 / 2)) {
    return "8th"
  } else if (
    numbersRoughlyEqual(fraction, 1 / 3) ||
    numbersRoughlyEqual(fraction, 2 / 3)
  ) {
    return "12th"
  } else if (
    numbersRoughlyEqual(fraction, 1 / 4) ||
    numbersRoughlyEqual(fraction, 3 / 4)
  ) {
    return "16th"
  } else if (
    numbersRoughlyEqual(fraction, 1 / 6) ||
    numbersRoughlyEqual(fraction, 5 / 6)
  ) {
    return "24th"
  } else if (
    numbersRoughlyEqual(fraction, 1 / 8) ||
    numbersRoughlyEqual(fraction, 3 / 8) ||
    numbersRoughlyEqual(fraction, 5 / 8) ||
    numbersRoughlyEqual(fraction, 7 / 8)
  ) {
    return "32nd"
  } else {
    return "other"
  }
}

function numbersRoughlyEqual(a: number, b: number) {
  return Math.abs(a - b) < 0.01
}

function getNoteDatas(
  measure: MeasureData,
  noteAreaHeight: number,
  displayOptions: DisplayOptions,
) {
  let prevY = noteAreaHeight - 1
  let prevTs = measure.startTimestamp
  let prevBpm = measure.startBpm
  let prevBeatTs = measure.startTimestamp

  const noteDatas: NoteData[] = []

  measure.rows.forEach(({ timestamp, measurebeatend, key, bpm }) => {
    const newTs = timestamp
    const newY = calculateNewY({
      prevY,
      prevBpm,
      prevTs,
      newTs,
      ...displayOptions,
    })

    if (measurebeatend === "m" || measurebeatend === "b") {
      prevBeatTs = timestamp
    }

    if (key !== null) {
      const rhythm = noteTimestampToRhythm(timestamp, prevBeatTs, prevBpm)

      keyNumToOrds(key).forEach((ord) => {
        noteDatas.push({
          lane: (ord + 1) as LaneOrd,
          y: newY,
          rhythm,
        })
      })
    }

    prevY = newY
    prevTs = newTs
    if (bpm !== null) {
      prevBpm = bpm
    }
  })

  return noteDatas
}

type NoteOrd = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export function keyNumToOrds(keyNum: number): NoteOrd[] {
  const ords: NoteOrd[] = []
  for (let ord = 0; ord <= 8; ord += 1) {
    if (((keyNum >> ord) & 0x1) === 1) {
      ords.push(ord as NoteOrd)
    }
  }
  return ords
}

interface HoldNoteData {
  lane: LaneOrd
  startY: number // start and end are chronological, so startY > endY.
  endY: number
  rhythm?: Rhythm // If hold note started in a different measure, rhythm is unknown.
  shouldDrawHead: boolean
  shouldDrawButt: boolean
}

function getHoldNoteDatas(
  measure: MeasureData,
  noteAreaHeight: number,
  displayOptions: DisplayOptions,
) {
  let prevY = noteAreaHeight - 1
  let prevTs = measure.startTimestamp
  let prevBpm = measure.startBpm
  let prevBeatTs = measure.startTimestamp

  // When did this key start being pressed.
  const ordToKeyOnY: (number | undefined)[] = []
  // Init special value for hold notes that started before this measure.
  keyNumToOrds(measure.startKeyOn).forEach((ord) => {
    ordToKeyOnY[ord] = -1
  })

  const ordToRhythm: (Rhythm | undefined)[] = []

  const holdNoteDatas: HoldNoteData[] = []

  measure.rows.forEach(({ timestamp, measurebeatend, keyon, keyoff, bpm }) => {
    const newTs = timestamp
    const newY = calculateNewY({
      prevY,
      prevBpm,
      prevTs,
      newTs,
      ...displayOptions,
    })

    if (measurebeatend === "m" || measurebeatend === "b") {
      prevBeatTs = timestamp
    }

    if (keyon !== null) {
      const rhythm = noteTimestampToRhythm(timestamp, prevBeatTs, prevBpm)

      keyNumToOrds(keyon).forEach((ord) => {
        ordToKeyOnY[ord] = newY
        ordToRhythm[ord] = rhythm
      })
    }

    if (keyoff !== null) {
      keyNumToOrds(keyoff).forEach((ord) => {
        const keyOnYForOrd = ordToKeyOnY[ord]
        let startY
        if (keyOnYForOrd !== undefined && keyOnYForOrd >= 0) {
          // Hold note started in this measure.
          startY = keyOnYForOrd
        } else {
          // Hold note started before this measure.
          startY = noteAreaHeight
        }

        holdNoteDatas.push({
          lane: (ord + 1) as LaneOrd,
          startY,
          endY: newY,
          rhythm: ordToRhythm[ord],
          shouldDrawHead: keyOnYForOrd !== undefined && keyOnYForOrd >= 0,
          shouldDrawButt: true,
        })

        ordToKeyOnY[ord] = undefined
        ordToRhythm[ord] = undefined
      })
    }

    prevY = newY
    prevTs = newTs
    if (bpm !== null) {
      prevBpm = bpm
    }
  })

  // Hold notes that didn't end in this measure.
  ordToKeyOnY.forEach((keyOnY, ord) => {
    if (keyOnY === undefined) {
      return
    }

    let startY
    if (keyOnY !== undefined && keyOnY >= 0) {
      // Hold note started in this measure.
      startY = keyOnY
    } else {
      // Hold note started before this measure.
      startY = noteAreaHeight
    }

    holdNoteDatas.push({
      lane: (ord + 1) as LaneOrd,
      startY,
      endY: 0,
      rhythm: ordToRhythm[ord],
      shouldDrawHead: keyOnY !== undefined && keyOnY >= 0,
      shouldDrawButt: false,
    })
  })

  return holdNoteDatas
}

function calculateNewY({
  prevY,
  prevBpm,
  prevTs,
  newTs,
  noteSpacing,
  bpmAgnostic,
}: {
  prevY: number
  prevBpm: number
  prevTs: number
  newTs: number
} & Pick<DisplayOptions, "noteSpacing" | "bpmAgnostic">) {
  const tsDelta = newTs - prevTs
  return (
    prevY - msToPixels({ ms: tsDelta, bpm: prevBpm, noteSpacing, bpmAgnostic })
  )
}

function msToPixels({
  ms,
  bpm,
  noteSpacing,
  bpmAgnostic,
}: { ms: number; bpm: number } & Pick<
  DisplayOptions,
  "noteSpacing" | "bpmAgnostic"
>) {
  const bpmFactor = bpmAgnostic ? 1.0 : bpm / 200.0
  return ms * PIXELS_PER_MS_BY_SPACING[noteSpacing] * bpmFactor
}

function formatTimestamp(timestamp: number) {
  const tsSec = timestamp / 1000
  const min = Math.floor(tsSec / 60)
  const sec = Math.floor(tsSec % 60)
  return `${min}:${sec.toString().padStart(2, "0")}`
}

function laneToColor(lane: LaneOrd): NoteColor {
  switch (lane) {
    case 1:
    case 9:
      return "white"
    case 2:
    case 8:
      return "yellow"
    case 3:
    case 7:
      return "green"
    case 4:
    case 6:
      return "blue"
    case 5:
      return "red"
  }
}

function rhythmToColor(rhythm: Rhythm): NoteColor {
  switch (rhythm) {
    case "4th":
      return "red"
    case "8th":
      return "blue"
    case "12th":
      return "purple"
    case "16th":
      return "yellow"
    case "24th":
      return "pink"
    case "32nd":
      return "orange"
    default:
      return "green"
  }
}

const NONRAN = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as LaneOrd[]
const MIRROR = [0, 9, 8, 7, 6, 5, 4, 3, 2, 1] as LaneOrd[]
const CROSS = [0, 2, 1, 4, 3, 5, 7, 6, 9, 8] as LaneOrd[]

function pluck<T>(arr: Array<T>, ...indices: number[]) {
  return indices.map((i) => arr[i])
}

function rotateMapRight(map: LaneOrd[], rotate: number): LaneOrd[] {
  const base = NONRAN.slice(1)
  for (let i = 0; i < rotate; i += 1) {
    base.unshift(base.pop()!)
  }
  return pluck(map, 0, ...base)
}

function mirrorMap(map: LaneOrd[]): LaneOrd[] {
  return pluck(map, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1)
}

function makeLaneMap(transformStr: string | null | undefined): LaneOrd[] {
  if (transformStr === undefined || transformStr === null) {
    return NONRAN
  }

  const transformStrNorm = transformStr.toLowerCase()
  const match = transformStrNorm.match(/\d/)
  const ords = transformStrNorm.split("").map(Number)

  switch (transformStrNorm) {
    case "":
    case "nonran":
    case "r0":
    case "r9":
    case "l0":
    case "l9":
      return NONRAN

    case "mirror":
    case "r0m":
    case "r9m":
    case "l0m":
    case "l9m":
      return MIRROR

    case "cross":
      return CROSS

    case "r1":
    case "r2":
    case "r3":
    case "r4":
    case "r5":
    case "r6":
    case "r7":
    case "r8":
      return rotateMapRight(NONRAN, Number(match![0]))

    case "r1m":
    case "r2m":
    case "r3m":
    case "r4m":
    case "r5m":
    case "r6m":
    case "r7m":
    case "r8m":
      return mirrorMap(rotateMapRight(NONRAN, Number(match![0])))

    case "l1":
    case "l2":
    case "l3":
    case "l4":
    case "l5":
    case "l6":
    case "l7":
    case "l8":
      return rotateMapRight(NONRAN, 9 - Number(match![0]))

    case "l1m":
    case "l2m":
    case "l3m":
    case "l4m":
    case "l5m":
    case "l6m":
    case "l7m":
    case "l8m":
      return mirrorMap(rotateMapRight(NONRAN, 9 - Number(match![0])))

    default:
      if (ords.length === 9 && ords.slice().sort().join("") === "123456789") {
        return pluck(NONRAN, 0, ...ords)
      }

      console.warn(
        `Found invalid transform: [${transformStr}]. Defaulting to nonran.`,
      )
      return NONRAN
  }
}

/**
 * Given a new-lane-to-old-lane transform string, produce an
 * old-lane-to-new-lane mapping that can be used to modify a chart's notes.
 */
export function makeLaneTransform(
  transformStr: string | null | undefined,
): LaneOrd[] {
  // From user input. Maps new lane to old lane.
  const newToOld = makeLaneMap(transformStr)

  // Invert because we need to map old lane to new lane.
  return newToOld.map((_, lane) =>
    newToOld.indexOf(lane as LaneOrd),
  ) as LaneOrd[]
}

export function isValidTransformStr(transformStr: string) {
  if (transformStr === "nonran") {
    return true
  }
  if (transformStr === "mirror") {
    return true
  }
  if (transformStr === "cross") {
    return true
  }
  if (transformStr.match(/^[LlRr]\dm?$/)) {
    return true
  }
  if (
    transformStr.match(/^\d{9}$/) &&
    transformStr.split("").sort().join("") === "123456789"
  ) {
    return true
  }
  return false
}

export interface ChartOptions {
  /**
   * Mapping from old lane to new lane.
   *
   * For ease of lookup, this should be of length 10, and the first item should
   * be ignored.
   *
   * Examples:
   *   nonran = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *   mirror = [0, 9, 8, 7, 6, 5, 4, 3, 2, 1]
   *   right1 = [0, 2, 3, 4, 5, 6, 7, 8, 9, 1]
   *
   * Note: This is the INVERSE of the user-facing transform map, which is new
   * lane to old lane.
   */
  laneTransform?: LaneOrd[]
}

export default function Measure({
  className,
  measureData,
  chartOptions,
  displayOptions,
}: {
  className?: string
  measureData: MeasureData
  chartOptions?: ChartOptions
  displayOptions: DisplayOptions
}) {
  const noteAreaHeight = getNoteAreaHeight(measureData, displayOptions)

  const tinyMeasure = noteAreaHeight < 40
  const rootStyle: CSSProperties = {}
  if (tinyMeasure) {
    rootStyle["height"] = noteAreaHeight + 2 // 2 = bottom border
  }

  const noteAreaStyle = {
    height: noteAreaHeight,
  }
  const guideLineDatas = getGuideLineDatas(
    measureData,
    noteAreaHeight,
    displayOptions,
  )
  const bpmEventDatas = getBpmEventDatas(
    measureData,
    noteAreaHeight,
    displayOptions,
  )
  const timingEventDatas = getTimingEventDatas(
    measureData,
    noteAreaHeight,
    displayOptions,
  )
  const noteDatas = getNoteDatas(measureData, noteAreaHeight, displayOptions)
  const holdNoteDatas = getHoldNoteDatas(
    measureData,
    noteAreaHeight,
    displayOptions,
  )
  // Show start bpm unless it would be covered up by the first bpm event.
  const showStartBpm =
    bpmEventDatas.length === 0 || noteAreaHeight - bpmEventDatas[0].y > 20
  const noteToLane = chartOptions?.laneTransform || NONRAN

  async function onMeasureLinkIconClick(index: number) {
    const url = `${location.origin}${location.pathname}${location.search}#${index}`
    await navigator.clipboard.writeText(url)
    toast(`Copied link to measure ${index}`)
  }

  return (
    <div
      className={cx(className, styles.Measure)}
      style={rootStyle}
      id={`measure${measureData.index}`}
    >
      <div className={cx(styles.measureNumber, tinyMeasure && styles.squish)}>
        <div className={styles.timestamp}>
          {formatTimestamp(measureData.startTimestamp)}
        </div>
        <div className={styles.num}>
          <button onClick={() => onMeasureLinkIconClick(measureData.index)}>
            <FaLink />
          </button>
          <a href={`#${measureData.index}`}>{measureData.index}</a>
        </div>
      </div>

      <div className={styles.noteArea} style={noteAreaStyle}>
        {displayOptions.chartEditingMode && measureData.index > 1 && (
          <div className={styles.debug}>
            <span
              className={styles.timestamp}
              onClick={(event) => {
                if (!event.metaKey) {
                  return
                }

                const textarea = document.getElementById(
                  "chartEditorTextarea",
                ) as HTMLTextAreaElement
                const lineNumber = textarea.value
                  .split("\n")
                  .map((line) => line.split(",")[0]) // timestamp
                  .indexOf(String(measureData.startTimestamp))
                const lineScrollTop = lineNumber * 24 // line height is 24px...maybe

                const textareaHeight = textarea.clientHeight
                const scrollPercentage =
                  event.currentTarget.getBoundingClientRect().y /
                  window.innerHeight
                const extraScrollTop = textareaHeight * scrollPercentage

                textarea.scrollTop = lineScrollTop - extraScrollTop
              }}
            >
              ⏰ {measureData.startTimestamp}
            </span>
            <span className={styles.notecount}>
              🎵 {measureData.startNoteCount}
            </span>
          </div>
        )}
        <div className={cx(styles.Lane, styles.pos1, styles.white)}></div>
        <div className={cx(styles.Lane, styles.pos2, styles.yellow)}></div>
        <div className={cx(styles.Lane, styles.pos3, styles.green)}></div>
        <div className={cx(styles.Lane, styles.pos4, styles.blue)}></div>
        <div className={cx(styles.Lane, styles.pos5, styles.red)}></div>
        <div className={cx(styles.Lane, styles.pos6, styles.blue)}></div>
        <div className={cx(styles.Lane, styles.pos7, styles.green)}></div>
        <div className={cx(styles.Lane, styles.pos8, styles.yellow)}></div>
        <div className={cx(styles.Lane, styles.pos9, styles.white)}></div>

        {guideLineDatas.map(({ type, y, timestamp }, index) => (
          <GuideLine key={index} type={type} y={y} timestamp={timestamp} />
        ))}

        {showStartBpm && (
          <div className={styles.startBpm}>{`${measureData.startBpm} bpm`}</div>
        )}

        {bpmEventDatas.map(({ type, bpm, y }, index) => (
          <BpmEvent key={index} type={type} bpm={bpm} y={y} />
        ))}

        {timingEventDatas.map(({ index, y }) => (
          <TimingEvent key={y} index={index} y={y} />
        ))}

        {noteDatas.map(({ lane, y, rhythm }, index) => {
          const style = {
            top: y - 6,
          }
          const laneToUse = noteToLane[lane]
          const row = laneToUse % 2 === 0 ? "top" : "bottom"

          let colorToUse
          if (displayOptions.noteColoring === "rhythm") {
            colorToUse = rhythmToColor(rhythm)
          } else {
            colorToUse = laneToColor(laneToUse)
          }

          return (
            <Note
              key={index}
              className={cx(styles.Note, styles[`pos${laneToUse}`])}
              style={style}
              color={colorToUse}
              row={row}
            />
          )
        })}

        {holdNoteDatas.map(
          (
            { lane, startY, endY, rhythm, shouldDrawHead, shouldDrawButt },
            index,
          ) => {
            const style = {
              top: endY,
            }
            const laneToUse = noteToLane[lane]
            const row = laneToUse % 2 === 0 ? "top" : "bottom"

            let colorToUse
            let shouldColorHeadOnly
            if (displayOptions.noteColoring === "rhythm") {
              colorToUse = rhythm ? rhythmToColor(rhythm) : "white"
              // When rhythm is unknown (for hold notes that started in different
              // measures) shouldDrawHead will be false anyway... but whatever...
              shouldColorHeadOnly = true
            } else {
              colorToUse = laneToColor(laneToUse)
              shouldColorHeadOnly = false
            }

            return (
              <HoldNote
                key={index}
                className={cx(styles.HoldNote, styles[`pos${laneToUse}`])}
                style={style}
                color={colorToUse}
                row={row}
                yDuration={startY - endY}
                shouldDrawHead={shouldDrawHead}
                shouldDrawButt={shouldDrawButt}
                shouldColorHeadOnly={shouldColorHeadOnly}
              />
            )
          },
        )}
      </div>

      <div className={styles.empty}></div>
    </div>
  )
}
