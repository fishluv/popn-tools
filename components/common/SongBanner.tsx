import cx from "classnames"
import styles from "./SongBanner.module.scss"

export default function SongBanner({
  className,
  songId,
  songTitle,
  width,
  height,
}: {
  className?: string
  songId: number
  songTitle: string
  width: number
  height: number
}) {
  const paddedId = `000${songId}`.slice(-4)
  const bannerUrl = `https://popn-assets.pages.dev/assets/kc_${paddedId}.png`
  // TODO: When height is smaller than normal, zoom instead of squish.

  return (
    <div className={cx(className, styles.SongBanner)} style={{ width, height }}>
      <div className={styles.title}>{songTitle}</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.bannerImage}
        src={bannerUrl}
        alt={`Banner for ${songTitle}`}
        width={width}
        height={height}
      />
    </div>
  )
}
