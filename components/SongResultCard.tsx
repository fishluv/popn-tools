import cx from "classnames"
import FolderPill from "./FolderPill"
import styles from "./SongResultCard.module.scss"
import Song from "../models/Song"

export default function SongResultCard({
  song,
  onClick,
}: {
  song: Song
  onClick(song: Song): void
}) {
  const bannerStyle = {
    backgroundImage: `url("${song.bannerUrl()}")`,
  }

  return (
    <button className={styles.SongResultCard} onClick={() => onClick(song)}>
      <div className={styles.title}>{song.title}</div>
      <div className={styles.banner} style={bannerStyle} />
      <div className={styles.folderLevels}>
        <div className={styles.folder}>
          <FolderPill folder={song.folder} style="compact" />
        </div>
        <div className={styles.levels}>
          {song.easyLevel && (
            <span className={cx(styles.diffLevel, styles.e, styles.compact)}>
              e {song.easyLevel}
            </span>
          )}
          {song.normalLevel && (
            <span className={cx(styles.diffLevel, styles.n, styles.compact)}>
              n {song.normalLevel}
            </span>
          )}
          {song.hyperLevel && (
            <span className={cx(styles.diffLevel, styles.h, styles.compact)}>
              h {song.hyperLevel}
            </span>
          )}
          {song.exLevel && (
            <span className={cx(styles.diffLevel, styles.ex, styles.compact)}>
              ex {song.exLevel}
            </span>
          )}
        </div>
      </div>
      <div className={styles.overlay} />
    </button>
  )
}
