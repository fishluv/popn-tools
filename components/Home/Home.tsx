import cx from "classnames"
import React from "react"
import styles from "./Home.module.scss"
import { BsGithub } from "react-icons/bs"
import NoteIcon from "../common/NoteIcon"
import Link from "next/link"

export default function Home() {
  return (
    <div className={styles.Home}>
      <div className={styles.main}>
        <p className={styles.sectionHeader}>
          <NoteIcon color="red" />
          <NoteIcon color="blue" />
          {`pop'n tools`}
          <NoteIcon color="blue" />
          <NoteIcon color="red" />
        </p>

        <Link className={styles.appCard} href="/search">
          <div className={cx(styles.container, styles.quickSearch)}>
            <div className={styles.title}>Quick search</div>

            <span className={styles.description}>
              Fast keyword search for songs and charts. Search by title, genre,
              artist, level, and more!
            </span>
          </div>
        </Link>

        <Link className={styles.appCard} href="/songs">
          <div className={cx(styles.container, styles.songIndex)}>
            <div className={styles.title}>Song index</div>

            <span className={styles.description}>
              {
                "Browse the entire pop'n song library. Filter and sort by song metadata."
              }
            </span>
          </div>
        </Link>

        <Link className={styles.appCard} href="/charts">
          <div className={cx(styles.container, styles.chartIndex)}>
            <div className={styles.title}>Chart index</div>

            <span className={styles.description}>
              {
                "Browse the entire pop'n chart library. Filter and sort by song metadata, as well as chart-specific data like bpm, note count, and duration."
              }
            </span>
          </div>
        </Link>

        <Link className={styles.appCard} href="/randomizer">
          <div className={cx(styles.container, styles.randomizer)}>
            <div className={styles.title}>Randomizer</div>

            <span className={styles.description}>
              Draw random charts for tournament matches, training, or to just
              mix things up!
            </span>
          </div>
        </Link>
      </div>

      <div className={styles.footer}>
        <a href="https://github.com/fishluv/popn-tools" target="_blank">
          <BsGithub />
        </a>
        <span className={styles.sha}>{process.env.GIT_SHA}</span>
      </div>
    </div>
  )
}
