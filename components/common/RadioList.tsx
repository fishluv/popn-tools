import cx from "classnames"
import styles from "./RadioList.module.scss"

export default function RadioList({
  className,
  name,
  options,
  selectedOption,
  setOption,
}: {
  className?: string
  /** Used to establish tab group. */
  name: string
  options: { id: string; label: string }[]
  selectedOption: string
  setOption(id: string): void
}) {
  return (
    <div className={cx(styles.RadioList, className)}>
      {options.map(({ id, label }) => {
        return (
          <div key={id} className={styles.option}>
            <input
              id={`${id}Radio`}
              name={name}
              type="radio"
              checked={id === selectedOption}
              onChange={() => setOption(id)}
            />
            <label htmlFor={`${id}Radio`}>{label}</label>
          </div>
        )
      })}
    </div>
  )
}
