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
  let bpmStr
  if (type === "initial") {
    bpmStr = `${bpm} bpm`
  } else if (type === "increase") {
    bpmStr = `▲ ${bpm} bpm`
  } else {
    bpmStr = `▼ ${bpm} bpm`
  }

  return (
    <div className={cx(styles.BpmEvent, styles[type])} style={style}>
      <div className={styles.line} />
      <div className={styles.bpm}>{bpmStr}</div>
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

export default function Measure({ measureData }: { measureData: MeasureData }) {
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

  async function onMeasureLinkIconClick(index: number) {
    const url = `${location.origin}${location.pathname}#${index}`
    await navigator.clipboard.writeText(url)
    toast(`Copied link to measure ${index}`)
  }

  return (
    <div className={styles.Measure} id={`measure${measureData.index}`}>
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
          return (
            <Note
              key={index}
              className={styles[`pos${lane}`]}
              style={style}
              color={laneToColor(lane)}
            />
          )
        })}

        {holdNoteDatas.map(
          ({ lane, startY, endY, shouldDrawHead, shouldDrawButt }, index) => {
            const style = {
              top: endY,
            }
            return (
              <HoldNote
                key={index}
                className={styles[`pos${lane}`]}
                style={style}
                color={laneToColor(lane)}
                yDuration={startY - endY}
                shouldDrawHead={shouldDrawHead}
                shouldDrawButt={shouldDrawButt}
              />
            )
          },
        )}
      </div>
    </div>
  )
}
