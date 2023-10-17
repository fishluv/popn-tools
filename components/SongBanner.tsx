import cx from "classnames"
import styles from "./SongBanner.module.scss"

export default function SongBanner({
  className,
  songId,
}: {
  className?: string
  songId: number
}) {
  const paddedId = `000${songId}`.slice(-4)
  const bannerUrl = `https://popn-assets.surge.sh/kc_${paddedId}.png`
  const bannerStyle = {
    backgroundImage: `url("${bannerUrl}")`,
  }

  return (
    <div className={cx(className, styles.SongBanner)} style={bannerStyle} />
  )
}
