import React from "react"
import styles from "./Home.module.scss"
import Link from "next/link"

export default function Home() {
  return (
    <div className={styles.Home}>
      Home
      <h1>
        <Link href="/randomizer">Randomizer</Link>
      </h1>
    </div>
  )
}
