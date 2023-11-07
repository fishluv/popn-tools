import Head from "next/head"
import SearchPage from "../components/SearchPage"

export async function getStaticProps() {
  return { props: { bodyClassName: "SearchPage" } }
}

export default function Search() {
  return (
    <>
      <Head>
        <title>{"Search songs & charts • Pop'n Tools"}</title>
      </Head>
      <SearchPage />
    </>
  )
}
