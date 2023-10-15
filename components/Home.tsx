import React from "react"
import styles from "./Home.module.scss"
import Link from "next/link"
import Card from "./Card"

export default function Home() {
  return (
    <div className={styles.Home}>
      <p className={styles.header}>pop&apos;n tools</p>

      <div>
        <Link href="/randomizer">
          <Card title="🎲&nbsp;&nbsp;Randomizer" color="red" />
        </Link>
      </div>

      <div>
        <Link href="/songs">
          <Card title="🔎&nbsp;&nbsp;Song search" color="yellow" />
        </Link>
      </div>

      <div>
        <Link href="/charts">
          <Card title="🔎&nbsp;&nbsp;Chart search" color="yellow" />
        </Link>
      </div>

      <div>
        <Link href="/listmaker">
          <Card title="📓&nbsp;&nbsp;List maker" color="green" />
        </Link>
      </div>

      <div>
        <Link href="/tiermaker">
          <Card title="📶&nbsp;&nbsp;Tier maker" color="blue" />
        </Link>
      </div>
    </div>
  )
}
