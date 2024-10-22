import cx from "classnames"
import styles from "./SongList.module.scss"
import Song from "../../models/Song"
import LevelPill from "../common/LevelPill"
import SongBanner from "../common/SongBanner"
import useExtraOptions from "../../lib/useExtraOptions"
import FolderPill from "../common/FolderPill"

function SongRow({
  song,
  romanize,
  onSongClick,
}: {
  song: Song
  romanize: boolean
  onSongClick(song: Song): void
}) {
  const extraOptions = useExtraOptions()
  const { id, title, genre, remywikiTitle, genreRomanTrans, charts, debut } =
    song
  return (
    <div className={styles.SongRow}>
      <button className={styles.left} onClick={() => onSongClick(song)}>
        <SongBanner
          songId={id}
          songTitle={remywikiTitle}
          width={160}
          height={40}
        />
        {extraOptions["songid"] && (
          <div className={cx(styles.songId, styles.compact)}>{id}</div>
        )}

        <div className={styles.levels}>
          {charts?.easy ? (
            <LevelPill
              className={cx(styles.levelPill, styles.easy)}
              difficulty="e"
              level={charts.easy.level}
              pillStyle="compact"
              labelStyle="compact"
            />
          ) : (
            <div className={cx(styles.placeholder, styles.easy)} />
          )}

          {charts?.normal ? (
            <LevelPill
              className={cx(styles.levelPill, styles.normal)}
              difficulty="n"
              level={charts.normal.level}
              pillStyle="compact"
              labelStyle="compact"
            />
          ) : (
            <div className={cx(styles.placeholder, styles.normal)} />
          )}

          {charts?.hyper ? (
            <LevelPill
              className={cx(styles.levelPill, styles.hyper)}
              difficulty="h"
              level={charts.hyper.level}
              pillStyle="compact"
              labelStyle="compact"
            />
          ) : (
            <div className={cx(styles.placeholder, styles.hyper)} />
          )}

          {charts?.ex ? (
            <LevelPill
              className={cx(styles.levelPill, styles.ex)}
              difficulty="ex"
              level={charts.ex.level}
              pillStyle="compact"
              labelStyle="compact"
            />
          ) : (
            <div className={cx(styles.placeholder, styles.ex)} />
          )}
        </div>

        <div className={styles.debut}>
          <FolderPill folder={debut} pillStyle="compact" labelStyle="compact" />
        </div>
      </button>

      <div className={styles.right}>
        <p className={styles.title}>{romanize ? remywikiTitle : title}</p>
        {title !== genre && (
          <p className={styles.genre}>{romanize ? genreRomanTrans : genre}</p>
        )}
      </div>
    </div>
  )
}

export default function SongList({
  songs,
  romanize,
  onSongClick,
}: {
  songs: Song[]
  romanize: boolean
  onSongClick(song: Song): void
}) {
  return (
    <div className={styles.SongList}>
      {songs.map((song) => (
        <SongRow
          key={song.id}
          song={song}
          romanize={romanize}
          onSongClick={onSongClick}
        />
      ))}
    </div>
  )
}
