import cx from "classnames"
import styles from "./More.module.scss"
import useLocalStorage from "../../lib/useLocalStorage"
import Link from "next/link"

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

      <h6>Credit</h6>
      <p>
        Romanized titles and genres come from{" "}
        <Link href="https://remywiki.com" target="_blank">
          RemyWiki
        </Link>
        . Ratings and S乱 levels come from{" "}
        <Link href="https://popn.wiki" target="_blank">
          popn.wiki
        </Link>
        .
      </p>

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
