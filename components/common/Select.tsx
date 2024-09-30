import cx from "classnames"
import styles from "./Select.module.scss"

export default function Select({
  className,
  id,
  label,
  options,
  dummyOption,
  selectedOption,
  setOption,
  disabled,
}: {
  className?: string
  id: string
  label: string
  options: { id: string; label?: string; disabled?: boolean }[]
  dummyOption?: string
  selectedOption: string
  setOption(id: string): void
  disabled?: boolean
}) {
  return (
    <div className={cx(styles.Select, className)}>
      <label htmlFor={id}>{label}</label>
      <select
        className={selectedOption ? "" : styles.dummySelected}
        id={id}
        value={selectedOption}
        onChange={(event) => setOption(event.target.value)}
        disabled={disabled}
      >
        {dummyOption && <option value="">{dummyOption}</option>}
        {options.map(({ id, label, disabled }) => {
          return (
            <option key={id} value={id} disabled={disabled}>
              {label || id}
            </option>
          )
        })}
      </select>
    </div>
  )
}
