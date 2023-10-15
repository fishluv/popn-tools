import React from "react"
import styles from "./Home.module.scss"
import Link from "next/link"
import Card from "./Card"

export default function Home() {
  return (
    <div className={styles.Home}>
      <p className={styles.header}>pop&apos;n tools</p>
      <Link href="/randomizer">
        <Card title="🎲&nbsp;&nbsp;Randomizer" color="red" />
      </Link>
    </div>
  )
}
