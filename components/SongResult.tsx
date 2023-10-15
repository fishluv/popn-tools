import styles from "./SongResult.module.scss"

export default function SongResult({ song }) {
  return <div className={styles.SongResult}>{song.remywiki_title}</div>
}
