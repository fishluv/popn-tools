import cx from "classnames"
import MeasureData from "../../models/MeasureData"
import styles from "./Measure.module.scss"

const PIXELS_PER_MS = 0.3

function getNoteAreaHeight(measure: MeasureData) {
  const durByBpm = { [measure.startBpm]: 0 }
  let currBpm = measure.startBpm
  let currTs = measure.startTimestamp

  measure.rows.forEach((row, index) => {
    if (index === 0) {
      return
    }

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

function Note({ lane, y }: NoteData) {
  const noteStyle = {
    top: y - 10, // Shift up a bit.
  }
  return (
    <div className={cx(styles.Note, styles[`lane${lane}`])} style={noteStyle}>
      O
    </div>
  )
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

export default function Measure({ measureData }: { measureData: MeasureData }) {
  const noteAreaHeight = getNoteAreaHeight(measureData)
  const noteAreaStyle = {
    height: noteAreaHeight,
  }
  const noteDatas = getNoteDatas(measureData, noteAreaHeight)
  const guideLineDatas = getGuideLineDatas(measureData, noteAreaHeight)

  return (
    <div className={styles.Measure}>
      <div className={styles.measureNumber}>{measureData.index}</div>
      <div className={styles.noteArea} style={noteAreaStyle}>
        <div className={cx(styles.Lane, styles.lane1)}></div>
        <div className={cx(styles.Lane, styles.lane2)}></div>
        <div className={cx(styles.Lane, styles.lane3)}></div>
        <div className={cx(styles.Lane, styles.lane4)}></div>
        <div className={cx(styles.Lane, styles.lane5)}></div>
        <div className={cx(styles.Lane, styles.lane6)}></div>
        <div className={cx(styles.Lane, styles.lane7)}></div>
        <div className={cx(styles.Lane, styles.lane8)}></div>
        <div className={cx(styles.Lane, styles.lane9)}></div>

        {guideLineDatas.map(({ type, y }, index) => (
          <GuideLine key={index} type={type} y={y} />
        ))}

        {noteDatas.map(({ lane, y }, index) => (
          <Note key={index} lane={lane} y={y} />
        ))}
      </div>
    </div>
  )
}
