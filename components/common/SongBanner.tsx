import cx from "classnames"
import styles from "./SongBanner.module.scss"
import Song from "../../models/Song"

export default function SongBanner({
  className,
  song: { id, title },
}: {
  className?: string
  song: Song
}) {
  const paddedId = `000${id}`.slice(-4)
  const bannerUrl = `https://popn-assets.surge.sh/kc_${paddedId}.png`
  const bannerStyle = {
    backgroundImage: `url("${bannerUrl}")`,
  }

  return (
    <div className={cx(className, styles.SongBanner)}>
      <div className={styles.title}>{title}</div>
      <div className={styles.banner} style={bannerStyle} />
    </div>
  )
}
