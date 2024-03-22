import Head from "next/head"
import SearchPage from "../components/SearchPage"
import { useSearchParams } from "next/navigation"

export default function Search() {
  const searchParams = useSearchParams()
  const mode = (searchParams.get("m") ?? "song") as "song" | "chart"

  return (
    <>
      <Head>
        <title>{"Search • Pop'n Tools"}</title>
      </Head>
      <SearchPage mode={mode} />
    </>
  )
}
