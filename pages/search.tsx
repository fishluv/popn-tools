import Head from "next/head"
import SearchPage from "../components/SearchPage"
import { useSearchParams } from "next/navigation"

export async function getServerSideProps({ query }: { query: string }) {
  const queryParams = new URLSearchParams(query)
  const mode = queryParams.get("m")
  if (mode !== "songs" && mode !== "charts") {
    queryParams.set("m", "songs")
    return {
      redirect: {
        destination: `/search?${queryParams.toString()}`,
        permanent: false,
      },
    }
  } else {
    return { props: {} }
  }
}

export default function Search() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("m") as "songs" | "charts"

  return (
    <>
      <Head>
        <title>{"Search songs & charts • Pop'n Tools"}</title>
      </Head>
      <SearchPage mode={mode} />
    </>
  )
}
