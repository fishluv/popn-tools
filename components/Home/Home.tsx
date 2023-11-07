import React from "react"
import styles from "./Home.module.scss"
import BigPill from "./BigPill"

export default function Home() {
  return (
    <div className={styles.Home}>
      <p className={styles.header}>pop&apos;n tools</p>

      <BigPill
        title="🎲&nbsp;&nbsp;Randomizer"
        color="red"
        href="/randomizer"
      />

      <BigPill title="🎵&nbsp;&nbsp;Search" color="purple" href="/search" />

      <BigPill
        title="📓&nbsp;&nbsp;List maker"
        color="green"
        href="/listmaker"
      />

      <BigPill
        title="📶&nbsp;&nbsp;Tier maker"
        color="blue"
        href="/tiermaker"
      />
    </div>
  )
}
