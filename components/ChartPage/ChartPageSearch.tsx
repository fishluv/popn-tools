import cx from "classnames"
import { useState } from "react"
import Chart from "../../models/Chart"
import styles from "./ChartPageSearch.module.scss"
import ChartSearchResultsList from "../SearchPage/ChartSearchResultsList"
import { useDebounce } from "../../lib/debounce"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LevelPill from "../common/LevelPill"

export function ChartPageSearch({ chart: chart }: { chart?: Chart }) {
  const [searchValue, setSearchValue] = useState("")
  const debouncedQuery = useDebounce(searchValue, 125)
  const router = useRouter()

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    // Remove leading whitespace. Only one trailing space allowed.
    const sanitized = value.replace(/^\s+/, "").replace(/\s+$/, " ")
    setSearchValue(sanitized)
  }

  function onChartClick(chart: Chart) {
    router.push(`/chart/${chart.song!.slug}/${chart.difficulty}`)
  }

  return (
    <div className={styles.ChartPageSearch}>
      {chart?.otherCharts && (
        <div className={styles.Detail}>
          <span>other charts</span>
          <span>
            {Object.keys(chart.otherCharts).length === 0 && "(none)"}
            {chart.otherCharts.e && (
              <Link
                className={cx(styles.otherChartLink, styles.e)}
                href={`/chart/${chart.song!.slug}/e`}
              >
                <LevelPill
                  difficulty="e"
                  level={chart.otherCharts.e}
                  labelStyle="compact"
                  pillStyle="compact"
                />
              </Link>
            )}
            {chart.otherCharts.n && (
              <Link
                className={cx(styles.otherChartLink, styles.n)}
                href={`/chart/${chart.song!.slug}/n`}
              >
                <LevelPill
                  difficulty="n"
                  level={chart.otherCharts.n}
                  labelStyle="compact"
                  pillStyle="compact"
                />
              </Link>
            )}
            {chart.otherCharts.h && (
              <Link
                className={cx(styles.otherChartLink, styles.h)}
                href={`/chart/${chart.song!.slug}/h`}
              >
                <LevelPill
                  difficulty="h"
                  level={chart.otherCharts.h}
                  labelStyle="compact"
                  pillStyle="compact"
                />
              </Link>
            )}
            {chart.otherCharts.ex && (
              <Link
                className={cx(styles.otherChartLink, styles.ex)}
                href={`/chart/${chart.song!.slug}/ex`}
              >
                <LevelPill
                  difficulty="ex"
                  level={chart.otherCharts.ex}
                  labelStyle="compact"
                  pillStyle="compact"
                />
              </Link>
            )}
          </span>
        </div>
      )}

      <input
        id="searchInput"
        className={styles.search}
        type="text"
        placeholder={"Search for charts"}
        value={searchValue}
        onChange={onInputChange}
        autoFocus
        size={1}
      />
      {/* https://stackoverflow.com/a/29990524
      size=1 is for super narrow browsers */}

      {debouncedQuery && (
        <ChartSearchResultsList
          query={debouncedQuery ?? ""}
          onChartClick={onChartClick}
        />
      )}
    </div>
  )
}
