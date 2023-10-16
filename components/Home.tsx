import React from "react"
import styles from "./Home.module.scss"
import Link from "next/link"
import BigPillLink from "./BigPillLink"

export default function Home() {
  return (
    <div className={styles.Home}>
      <p className={styles.header}>pop&apos;n tools</p>

      <div>
        <Link href="/randomizer">
          <BigPillLink title="🎲&nbsp;&nbsp;Randomizer" color="red" />
        </Link>
      </div>

      <div>
        <Link href="/songs">
          <BigPillLink title="🔎&nbsp;&nbsp;Song search" color="yellow" />
        </Link>
      </div>

      <div>
        <Link href="/charts">
          <BigPillLink title="🔎&nbsp;&nbsp;Chart search" color="yellow" />
        </Link>
      </div>

      <div>
        <Link href="/listmaker">
          <BigPillLink title="📓&nbsp;&nbsp;List maker" color="green" />
        </Link>
      </div>

      <div>
        <Link href="/tiermaker">
          <BigPillLink title="📶&nbsp;&nbsp;Tier maker" color="blue" />
        </Link>
      </div>
    </div>
  )
}
