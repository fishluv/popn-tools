import cx from "classnames"
import styles from "./SongResults.module.scss"
import { ListParams, useListSongs } from "../../lib/list"
import Song from "../../models/Song"
import PageInfo from "./PageInfo"
import SongList from "./SongList"

export default function SongResults({
  className,
  params,
  onSongClick,
  romanize,
}: {
  className?: string
  params: ListParams
  onSongClick(song: Song): void
  romanize: boolean
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
    <div className={cx(className, styles.SongResults)}>
      <PageInfo {...pagy} />
      <SongList songs={songs} romanize={romanize} onSongClick={onSongClick} />
      <PageInfo {...pagy} />
    </div>
  )
}
