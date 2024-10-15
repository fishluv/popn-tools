/** Encapsulates markup and state logic for radio button group. No styling. */
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
    <div className={className}>
      {options.map(({ id, label }) => {
        return (
          <div key={id}>
            <input
              id={`${name}${id}Radio`}
              name={name}
              type="radio"
              checked={id === selectedOption}
              onChange={() => setOption(id)}
            />
            <label htmlFor={`${name}${id}Radio`}>{label}</label>
          </div>
        )
      })}
    </div>
  )
}
