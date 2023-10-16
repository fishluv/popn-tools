import cx from "classnames"
import FolderPill from "./FolderPill"
import styles from "./SongResult.module.scss"
import { Song } from "./Song"

export default function SongResultCard({ song }: { song: Song }) {
  const paddedId = `000${song.id}`.slice(-4)
  const bannerUrl = `https://popn-assets.surge.sh/kc_${paddedId}.png`
  const bannerStyle = {
    backgroundImage: `url("${bannerUrl}")`,
  }

  return (
    <div className={styles.SongResult}>
      <div className={styles.banner} style={bannerStyle} />
      <div className={styles.folderLevels}>
        <div className={styles.folder}>
          <FolderPill songFolder={song.folder} />
        </div>
        <div className={styles.levels}>
          {song.easy_diff && (
            <span className={cx(styles.diffLevel, styles.e, styles.compact)}>
              e {song.easy_diff}
            </span>
          )}
          {song.normal_diff && (
            <span className={cx(styles.diffLevel, styles.n, styles.compact)}>
              n {song.normal_diff}
            </span>
          )}
          {song.hyper_diff && (
            <span className={cx(styles.diffLevel, styles.h, styles.compact)}>
              h {song.hyper_diff}
            </span>
          )}
          {song.ex_diff && (
            <span className={cx(styles.diffLevel, styles.ex, styles.compact)}>
              ex {song.ex_diff}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}