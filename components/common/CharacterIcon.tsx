import cx from "classnames"
import styles from "./CharacterIcon.module.scss"
import Character from "../../models/Character"
import VersionFolder from "../../models/VersionFolder"
import OtherFolder from "../../models/OtherFolder"

export default function CharacterIcon({
  className,
  character: { charaId, icon1 },
  songFolder,
}: {
  className?: string
  character: Character
  songFolder: VersionFolder | OtherFolder | null
}) {
  const iconUrl = `https://popn-assets.pages.dev/assets/${charaId}/${icon1}.png`
  const iconStyle = {
    backgroundImage: `url("${iconUrl}")`,
  }
  const rootClass = cx(className, styles.CharacterIcon, {
    [styles.zoom]: songFolder && Number(songFolder) <= 5,
  })

  return <div className={rootClass} style={iconStyle} />
}
