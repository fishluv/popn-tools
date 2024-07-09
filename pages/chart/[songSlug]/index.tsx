import { useRouter } from "next/router"
import ChartPage from "../../../components/ChartPage"
import Link from "next/link"
import Head from "next/head"

export function makeChartPageHandler(difficulty: "e" | "n" | "h" | "ex") {
  return function ChartPageHandler() {
    const {
      query: { songSlug },
    } = useRouter()

    // Note: songSlug is undefined on first render. Make sure page component can handle undefined.
    // Flatten string[] into string but preserve undefined.
    return (
      <>
        <Head>
          <title>{"Chart Viewer • Pop'n Tools"}</title>
        </Head>
        <ChartPage
          songSlug={songSlug ? String(songSlug) : songSlug}
          difficulty={difficulty}
        />
      </>
    )
  }
}

export default function SongPageHandler() {
  const {
    query: { songSlug },
    asPath,
  } = useRouter()

  return (
    <div>
      {songSlug && (
        <>
          <div>{String(songSlug).replaceAll("-", " ")}</div>
          <div>
            <Link href={`${asPath}/e`}>easy</Link>
          </div>
          <div>
            <Link href={`${asPath}/n`}>normal</Link>
          </div>
          <div>
            <Link href={`${asPath}/h`}>hyper</Link>
          </div>
          <div>
            <Link href={`${asPath}/ex`}>ex</Link>
          </div>
        </>
      )}
    </div>
  )
}
