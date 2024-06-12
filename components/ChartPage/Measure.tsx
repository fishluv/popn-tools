import MeasureData from "../../models/MeasureData"
import styles from "./Measure.module.scss"

const PIXELS_PER_MS = 0.4

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

export default function Measure({ measure }: { measure: MeasureData }) {
  const noteAreaStyle = {
    height: getNoteAreaHeight(measure),
  }

  return (
    <div className={styles.Measure}>
      <div className={styles.measureNumber}>{measure.index}</div>
      <div className={styles.noteArea} style={noteAreaStyle}>
        <div className={styles.lane1}></div>
        <div className={styles.lane2}></div>
        <div className={styles.lane3}></div>
        <div className={styles.lane4}></div>
        <div className={styles.lane5}></div>
        <div className={styles.lane6}></div>
        <div className={styles.lane7}></div>
        <div className={styles.lane8}></div>
        <div className={styles.lane9}></div>

        <div className={styles.guideLines}></div>
        <div className={styles.bpmChanges}></div>
        <div className={styles.notes}></div>
        <div className={styles.holdNotes}></div>
      </div>
    </div>
  )
}
