import { ListParams, useListSongs } from "../../lib/list"
import Song from "../../models/Song"
import PageInfo from "./PageInfo"
import SongList from "./SongList"

export default function SongResults({
  params,
  onSongClick,
}: {
  params: ListParams
  onSongClick(song: Song): void
}) {
  const { data, error, isLoading } = useListSongs(params)

  if (error) {
    console.error(
      `Error filtering songs: ${JSON.stringify(error.data) || error}`,
    )
    return <div>Uh oh! Something went wrong.</div>
  }
  if (!data || isLoading) {
    return <div>Loading...</div>
  }

  const { songs, pagy } = data

  return (
    <>
      <PageInfo {...pagy} />
      <SongList
        songs={songs}
        romanize={!!params.sorts?.[0]?.match(/^-?r/)}
        onSongClick={onSongClick}
      />
      <PageInfo {...pagy} />
    </>
  )
}
