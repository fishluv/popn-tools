import cx from "classnames"
import MeasureData from "../../models/MeasureData"
import styles from "./Measure.module.scss"

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
      bpmEventDatas.push({
        type,
        bpm,
        y: newY,
      })

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

function Note({ lane, y }: NoteData) {
  const noteStyle = {
    top: y - 6, // Shift up a bit.
  }
  return (
    <div className={cx(styles.Note, styles[`lane${lane}`])} style={noteStyle} />
  )
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

function HoldNote({
  lane,
  startY,
  endY,
  shouldDrawHead,
  shouldDrawButt,
}: HoldNoteData) {
  const bodyHeight = startY - endY
  const bodyStyle = {
    top: endY,
    height: bodyHeight,
  }

  const buttStyle = {
    top: endY - 5, // Shift up a bit.
  }

  const headStyle = {
    top: startY - 6, // Shift up a bit.
  }

  return (
    <div className={cx(styles.HoldNote, styles[`lane${lane}`])}>
      {shouldDrawButt && <div className={styles.butt} style={buttStyle} />}
      <div className={styles.body} style={bodyStyle} />
      {shouldDrawHead && <div className={styles.head} style={headStyle} />}
    </div>
  )
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
  const guideLineDatas = getGuideLineDatas(measureData, noteAreaHeight)
  const bpmEventDatas = getBpmEventDatas(measureData, noteAreaHeight)
  const noteDatas = getNoteDatas(measureData, noteAreaHeight)
  const holdNoteDatas = getHoldNoteDatas(measureData, noteAreaHeight)

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

        {bpmEventDatas.map(({ type, bpm, y }, index) => (
          <BpmEvent key={index} type={type} bpm={bpm} y={y} />
        ))}

        {noteDatas.map(({ lane, y }, index) => (
          <Note key={index} lane={lane} y={y} />
        ))}

        {holdNoteDatas.map(
          ({ lane, startY, endY, shouldDrawHead, shouldDrawButt }, index) => (
            <HoldNote
              key={index}
              lane={lane}
              startY={startY}
              endY={endY}
              shouldDrawHead={shouldDrawHead}
              shouldDrawButt={shouldDrawButt}
            />
          ),
        )}
      </div>
    </div>
  )
}
