import cx from "classnames"
import MeasureData from "../../models/MeasureData"
import Measure from "./Measure"
import styles from "./MeasureList.module.scss"

export default function MeasureList({
  className,
  measureDatas,
}: {
  className?: string
  measureDatas: MeasureData[]
}) {
  return (
    <div className={cx(styles.MeasureList, className)}>
      {measureDatas.map((measureData, index) => (
        <div key={index}>
          <Measure measureData={measureData} />
        </div>
      ))}
    </div>
  )
}
