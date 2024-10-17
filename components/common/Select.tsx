/** Encapsulates markup and state logic for <select>. No styling. */
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
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <select
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
