import cx from "classnames"
import MeasureData from "../../models/MeasureData"
import Measure, { ChartOptions, DisplayOptions } from "./Measure"
import styles from "./MeasureList.module.scss"

export default function MeasureList({
  className,
  measureDatas,
  chartOptions,
  displayOptions,
}: {
  className?: string
  measureDatas: MeasureData[]
  chartOptions?: ChartOptions
  displayOptions: DisplayOptions
}) {
  return (
    <div className={cx(styles.MeasureList, className)}>
      {measureDatas.reverse().map((measureData, index) => (
        <div key={index}>
          <Measure
            measureData={measureData}
            chartOptions={chartOptions}
            displayOptions={displayOptions}
          />
        </div>
      ))}
    </div>
  )
}
