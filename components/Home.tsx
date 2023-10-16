import React from "react"
import styles from "./Home.module.scss"
import Link from "next/link"
import BigPill from "./BigPill"

export default function Home() {
  return (
    <div className={styles.Home}>
      <p className={styles.header}>pop&apos;n tools</p>

      <div>
        <Link href="/randomizer">
          <BigPill title="🎲&nbsp;&nbsp;Randomizer" color="red" />
        </Link>
      </div>

      <div>
        <Link href="/songs">
          <BigPill title="🔎&nbsp;&nbsp;Song search" color="yellow" />
        </Link>
      </div>

      <div>
        <Link href="/charts">
          <BigPill title="🔎&nbsp;&nbsp;Chart search" color="yellow" />
        </Link>
      </div>

      <div>
        <Link href="/listmaker">
          <BigPill title="📓&nbsp;&nbsp;List maker" color="green" />
        </Link>
      </div>

      <div>
        <Link href="/tiermaker">
          <BigPill title="📶&nbsp;&nbsp;Tier maker" color="blue" />
        </Link>
      </div>
    </div>
  )
}
