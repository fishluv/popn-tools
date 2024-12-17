import { useState } from "react"
import Chart from "../../models/Chart"
import styles from "./ChartPageSearch.module.scss"
import ChartSearchResultsList from "../SearchPage/ChartSearchResultsList"
import { useDebounce } from "../../lib/debounce"
import { useRouter } from "next/navigation"

export function ChartPageSearch() {
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
