import Head from "next/head"
import SongSearchPage from "../components/SongSearchPage"

export async function getStaticProps() {
  return { props: { bodyClassName: "SongSearchPage" } }
}

export default function Songs() {
  return (
    <>
      <Head>
        <title>Song search • Pop&apos;n Tools</title>
      </Head>
      <SongSearchPage />
    </>
  )
}
