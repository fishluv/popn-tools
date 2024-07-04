import cx from "classnames"
import toast from "react-hot-toast"
import { FaLink } from "react-icons/fa6"
import MeasureData from "../../models/MeasureData"
import styles from "./Measure.module.scss"
import Note, { NoteColor } from "./Note"
import HoldNote from "./HoldNote"

const PIXELS_PER_MS = 0.3

function getNoteAreaHeight(measure: MeasureData) {
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
    const bpmFactor = Number(bpm) / 200.0
    noteAreaHeight += duration * PIXELS_PER_MS * bpmFactor
  })

  return noteAreaHeight
}

interface GuideLineData {
  type: "beat" | "half"
  y: number
}

function getGuideLineDatas(measure: MeasureData, noteAreaHeight: number) {
  let prevY = noteAreaHeight - 1
  let prevTs = measure.startTimestamp
  let prevBpm = measure.startBpm
  let prevBeatY = noteAreaHeight - 1

  const guideLineDatas: GuideLineData[] = []

  measure.rows.forEach(({ timestamp, measurebeatend, bpm }, index) => {
    const newTs = timestamp
    const newY = calculateNewY({ prevY, prevBpm, prevTs, newTs })

    // Ignore "m". We draw measure lines with a simple border.
    // Ignore "e". Not needed for now.
    if (measurebeatend === "b") {
      guideLineDatas.push({
        type: "beat",
        y: newY,
      })

      if (index !== 0) {
        guideLineDatas.push({
          type: "half",
          y: (prevBeatY + newY) / 2.0,
        })

        prevBeatY = newY
      }
    }

    prevY = newY
    prevTs = newTs
    if (bpm !== null) {
      prevBpm = bpm
    }
  })

  const endTs = measure.startTimestamp + measure.duration
  const endY = calculateNewY({ prevY, prevBpm, prevTs, newTs: endTs })
  guideLineDatas.push({
    type: "half",
    y: (prevBeatY + endY) / 2.0,
  })

  return guideLineDatas
}

function GuideLine({ type, y }: GuideLineData) {
  const style = {
    top: y,
  }
  return <div className={cx(styles.GuideLine, styles[type])} style={style} />
}

interface BpmEventData {
  type: "initial" | "increase" | "decrease"
  bpm: number
  y: number
}

function getBpmEventDatas(measure: MeasureData, noteAreaHeight: number) {
  let prevY = noteAreaHeight - 1
  let prevTs = measure.startTimestamp
  let prevBpm = measure.startBpm

  const bpmEventDatas: BpmEventData[] = []

  measure.rows.forEach(({ timestamp, bpm }) => {
    const newTs = timestamp
    const newY = calculateNewY({ prevY, prevBpm, prevTs, newTs })

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

type LaneOrd = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
interface NoteData {
  lane: LaneOrd
  y: number
}

function getNoteDatas(measure: MeasureData, noteAreaHeight: number) {
  let prevY = noteAreaHeight - 1
  let prevTs = measure.startTimestamp
  let prevBpm = measure.startBpm

  const noteDatas: NoteData[] = []

  measure.rows.forEach(({ timestamp, key, bpm }) => {
    const newTs = timestamp
    const newY = calculateNewY({ prevY, prevBpm, prevTs, newTs })

    if (key !== null) {
      keyNumToOrds(key).forEach((ord) => {
        noteDatas.push({
          lane: (ord + 1) as LaneOrd,
          y: newY,
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
function keyNumToOrds(keyNum: number): NoteOrd[] {
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
  shouldDrawHead: boolean
  shouldDrawButt: boolean
}

function getHoldNoteDatas(measure: MeasureData, noteAreaHeight: number) {
  let prevY = noteAreaHeight - 1
  let prevTs = measure.startTimestamp
  let prevBpm = measure.startBpm

  // When did this key start being pressed.
  const ordToKeyOnY: (number | undefined)[] = []
  // Init special value for hold notes that started before this measure.
  keyNumToOrds(measure.startKeyOn).forEach((ord) => {
    ordToKeyOnY[ord] = -1
  })

  const holdNoteDatas: HoldNoteData[] = []

  measure.rows.forEach(({ timestamp, keyon, keyoff, bpm }) => {
    const newTs = timestamp
    const newY = calculateNewY({ prevY, prevBpm, prevTs, newTs })

    if (keyon !== null) {
      keyNumToOrds(keyon).forEach((ord) => {
        ordToKeyOnY[ord] = newY
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
          shouldDrawHead: keyOnYForOrd !== undefined && keyOnYForOrd >= 0,
          shouldDrawButt: true,
        })

        ordToKeyOnY[ord] = undefined
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
}: {
  prevY: number
  prevBpm: number
  prevTs: number
  newTs: number
}) {
  const tsDelta = newTs - prevTs
  const bpmFactor = prevBpm / 200.0
  return prevY - tsDelta * PIXELS_PER_MS * bpmFactor
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

const NONRAN = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as LaneOrd[]
const MIRROR = [0, 9, 8, 7, 6, 5, 4, 3, 2, 1] as LaneOrd[]

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
}: {
  className?: string
  measureData: MeasureData
  chartOptions?: ChartOptions
}) {
  const noteAreaHeight = getNoteAreaHeight(measureData)
  const noteAreaStyle = {
    height: noteAreaHeight,
  }
  const guideLineDatas = getGuideLineDatas(measureData, noteAreaHeight)
  const bpmEventDatas = getBpmEventDatas(measureData, noteAreaHeight)
  const noteDatas = getNoteDatas(measureData, noteAreaHeight)
  const holdNoteDatas = getHoldNoteDatas(measureData, noteAreaHeight)
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
      id={`measure${measureData.index}`}
    >
      <div className={styles.measureNumber}>
        <div className={styles.timestamp}>
          {formatTimestamp(measureData.startTimestamp)}
        </div>
        <div className={styles.num}>
          <a
            href="javascript:void(0)"
            onClick={() => onMeasureLinkIconClick(measureData.index)}
          >
            <FaLink size="1.25rem" />
          </a>
          <span>{measureData.index}</span>
        </div>
      </div>
      <div className={styles.noteArea} style={noteAreaStyle}>
        <div className={cx(styles.Lane, styles.pos1, styles.white)}></div>
        <div className={cx(styles.Lane, styles.pos2, styles.yellow)}></div>
        <div className={cx(styles.Lane, styles.pos3, styles.green)}></div>
        <div className={cx(styles.Lane, styles.pos4, styles.blue)}></div>
        <div className={cx(styles.Lane, styles.pos5, styles.red)}></div>
        <div className={cx(styles.Lane, styles.pos6, styles.blue)}></div>
        <div className={cx(styles.Lane, styles.pos7, styles.green)}></div>
        <div className={cx(styles.Lane, styles.pos8, styles.yellow)}></div>
        <div className={cx(styles.Lane, styles.pos9, styles.white)}></div>

        {guideLineDatas.map(({ type, y }, index) => (
          <GuideLine key={index} type={type} y={y} />
        ))}

        {showStartBpm && (
          <div className={styles.startBpm}>{`${measureData.startBpm} bpm`}</div>
        )}

        {bpmEventDatas.map(({ type, bpm, y }, index) => (
          <BpmEvent key={index} type={type} bpm={bpm} y={y} />
        ))}

        {noteDatas.map(({ lane, y }, index) => {
          const style = {
            top: y - 6,
          }
          const laneToUse = noteToLane[lane]
          return (
            <Note
              key={index}
              className={cx(styles.Note, styles[`pos${laneToUse}`])}
              style={style}
              color={laneToColor(laneToUse)}
            />
          )
        })}

        {holdNoteDatas.map(
          ({ lane, startY, endY, shouldDrawHead, shouldDrawButt }, index) => {
            const style = {
              top: endY,
            }
            const laneToUse = noteToLane[lane]
            return (
              <HoldNote
                key={index}
                className={cx(styles.HoldNote, styles[`pos${laneToUse}`])}
                style={style}
                color={laneToColor(laneToUse)}
                yDuration={startY - endY}
                shouldDrawHead={shouldDrawHead}
                shouldDrawButt={shouldDrawButt}
              />
            )
          },
        )}
      </div>
      <div className={styles.empty}></div>
    </div>
  )
}
