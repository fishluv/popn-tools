import Head from "next/head"
import BrowsePage from "../components/BrowsePage"

export interface RawSong {
  id: number
  title: string
  fwTitle: string
  rTitle: string
  genre: string
  fwGenre: string
  rGenre: string
  debut: string
  slug: string
  e: number | null
  n: number | null
  h: number | null
  ex: number | null
}

export async function getStaticProps() {
  const res = await fetch("https://popn-assets.pages.dev/db/songs.json")
  const rawSongs = (await res.json()) as RawSong[]
  return { props: { rawSongs } }
}

export default function Browse({ rawSongs }: { rawSongs: RawSong[] }) {
  const songsByDebut = Object.groupBy(rawSongs, ({ debut }) => debut)

  return (
    <>
      <Head>
        <title>{"Browse • Pop'n Tools"}</title>
      </Head>
      <BrowsePage songsByDebut={songsByDebut} />
    </>
  )
}
