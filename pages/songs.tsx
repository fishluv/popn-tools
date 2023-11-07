import Head from "next/head"
import SearchPage from "../components/SearchPage"

export async function getStaticProps() {
  return { props: { bodyClassName: "SearchPage" } }
}

export default function Songs() {
  return (
    <>
      <Head>
        <title>Song search • Pop&apos;n Tools</title>
      </Head>
      <SearchPage />
    </>
  )
}
