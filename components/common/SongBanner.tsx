import cx from "classnames"
import styles from "./SongBanner.module.scss"
import Song from "../../models/Song"

export default function SongBanner({
  className,
  song: { id, title },
  width,
  height,
}: {
  className?: string
  song: Song
  width: number
  height: number
}) {
  const paddedId = `000${id}`.slice(-4)
  const bannerUrl = `https://popn-assets.pages.dev/assets/kc_${paddedId}.png`
  // TODO: When height is smaller than normal, zoom instead of squish.

  return (
    <div className={cx(className, styles.SongBanner)} style={{ width, height }}>
      <div className={styles.title}>{title}</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.bannerImage}
        src={bannerUrl}
        alt={`Banner for ${title}`}
        width={width}
        height={height}
      />
    </div>
  )
}
