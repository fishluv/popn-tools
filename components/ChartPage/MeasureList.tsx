import MeasureData from "../../models/MeasureData"
import Measure from "./Measure"
import styles from "./MeasureList.module.scss"

export default function MeasureList({
  measureDatas,
}: {
  measureDatas: MeasureData[]
}) {
  return (
    <div className={styles.MeasureList}>
      {measureDatas.map((measureData, index) => (
        <div key={index}>
          <Measure measureData={measureData} />
        </div>
      ))}
    </div>
  )
}
