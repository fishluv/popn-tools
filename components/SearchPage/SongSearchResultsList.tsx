import styles from "./SongSearchResultsList.module.scss"
import { useSearchSong } from "../../lib/search"
import SongResultCard from "./SongResultCard"
import Song from "../../models/Song"

export default function SongSearchResultsList({
  query,
  onSongClick,
}: {
  query: string
  onSongClick(song: Song): void
}) {
  const {
    data: songResults,
    error,
    isLoading,
  } = useSearchSong({ query, limit: 15 })

  if (error) {
    console.error(
      `Error searching for songs: ${JSON.stringify(error.data) || error}`,
    )
    return <div>Uh oh! Something went wrong.</div>
  }
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.SongSearchResultsList}>
      {songResults &&
        songResults.map((songResult: Song, index: number) => (
          <SongResultCard key={index} song={songResult} onClick={onSongClick} />
        ))}
    </div>
  )
}
