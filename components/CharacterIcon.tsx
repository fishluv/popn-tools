import cx from "classnames"
import styles from "./CharacterIcon.module.scss"
import Character from "../models/Character"
import Folder from "../models/Folder"

export default function CharacterIcon({
  className,
  character: { charaId, icon1 },
  songFolder,
}: {
  className?: string
  character: Character
  songFolder?: Folder
}) {
  const iconUrl = `https://popn-assets.surge.sh/${charaId}/${icon1}.png`
  const iconStyle = {
    backgroundImage: `url("${iconUrl}")`,
  }
  const rootClass = cx(className, styles.CharacterIcon, {
    [styles.zoom]: Number(songFolder?.norm) <= 5,
  })

  return <div className={rootClass} style={iconStyle} />
}
