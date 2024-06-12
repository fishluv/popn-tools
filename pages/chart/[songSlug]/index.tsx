import { useRouter } from "next/router"
import ChartPage from "../../../components/ChartPage"

export function makeChartPageHandler(difficulty: "e" | "n" | "h" | "ex") {
  return function () {
    const {
      query: { songSlug },
    } = useRouter()

    // Note: songSlug is undefined on first render. Make sure page component can handle undefined.
    // Flatten string[] into string but preserve undefined.
    return ChartPage(songSlug ? String(songSlug) : songSlug, difficulty)
  }
}
