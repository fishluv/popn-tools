import styles from "./More.module.scss"
import { BsMusicNoteBeamed } from "react-icons/bs"
import { CgNotes } from "react-icons/cg"

export default function More() {
  return (
    <div className={styles.More}>
      <h6>What is this?</h6>
      <p>This is a quick search tool for pop&apos;n music songs and charts.</p>

      <h6>Tips</h6>
      <ul>
        <li>
          You can search by title, genre, artist, folder, difficulty, level, and
          more!
        </li>
        <li>
          Tap <BsMusicNoteBeamed />/<CgNotes /> to switch between songs and
          charts.
        </li>
        <li>For now, only whole word matching is supported.</li>
        <li>
          This is not meant for exhaustive searches. Only the first dozen or so
          results are returned.
        </li>
      </ul>
      {/* <Link href="/">
        <FiArrowLeft /> {"Back to Pop'n Tools"}
      </Link> */}
    </div>
  )
}
