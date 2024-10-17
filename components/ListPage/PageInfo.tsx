import styles from "./PageInfo.module.scss"
import { PagyMetadata } from "../../lib/list"
import Link from "next/link"

export default function PageInfo({ count, page, series }: PagyMetadata) {
  return (
    <div className={styles.PageInfo}>
      <span>{count} total</span>
      {"•"}
      <span>Page</span>
      {series.map((pageOrGap, index) => {
        if (pageOrGap === "gap") {
          return <span key={index}>...</span>
        }
        if (Number(pageOrGap) === page) {
          return <span key={index}>{page}</span>
        }

        const newParams = new URLSearchParams(window.location.search)
        newParams.set("page", String(pageOrGap))
        return (
          <span key={index}>
            <Link href={`${window.location.pathname}?${newParams}`}>
              {pageOrGap}
            </Link>
          </span>
        )
      })}
    </div>
  )
}
