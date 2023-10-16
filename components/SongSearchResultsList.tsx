import styles from "./SongSearchResultsList.module.scss"
import { SongResult, useSearchSong } from "../lib/fetch"
import SongResultCard from "./SongResultCard"

export default function SongSearchResultsList({
  query,
  onSongClick,
}: {
  query: string
  onSongClick(song: SongResult): void
}) {
  const { data, error, isLoading } = useSearchSong({ query, limit: 9 })

  if (error) {
    console.error(`Error searching for songs: ${JSON.stringify(error.data)}`)
    return <div>Uh oh! Something went wrong.</div>
  }
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.SongSearchResultsList}>
      {data &&
        data.map((song: SongResult, index: number) => (
          <SongResultCard key={index} song={song} onClick={onSongClick} />
        ))}
    </div>
  )
}
