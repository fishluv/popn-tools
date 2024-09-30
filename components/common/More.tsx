import cx from "classnames"
import styles from "./More.module.scss"
import useLocalStorage from "../../lib/useLocalStorage"

export default function More({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const [extraOptions, setExtraOptions] = useLocalStorage("extraOptions", "")

  return (
    <div className={cx(className, styles.More)}>
      {children}

      <h6>Extra options</h6>
      <input
        type="text"
        value={extraOptions}
        onChange={(event) => {
          setExtraOptions(event.currentTarget.value)
        }}
      />
    </div>
  )
}
