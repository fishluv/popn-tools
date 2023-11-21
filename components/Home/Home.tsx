import React from "react"
import styles from "./Home.module.scss"
import BigPill from "./BigPill"
import { CgDice3, CgSearch } from "react-icons/cg"
import { TbLayoutList } from "react-icons/tb"
import { LuBarChartHorizontal } from "react-icons/lu"

export default function Home() {
  return (
    <div className={styles.Home}>
      <p className={styles.header}>pop&apos;n tools</p>

      <BigPill className={styles.BigPill} color="red" href="/randomizer">
        <CgDice3 size="1.25rem" strokeWidth={1} />
        <span>Randomizer</span>
      </BigPill>

      <BigPill className={styles.BigPill} color="yellow" href="/search">
        <CgSearch size="1.25rem" strokeWidth={1} />
        <span>Quick search</span>
      </BigPill>

      <BigPill className={styles.BigPill} color="green" href="/listmaker">
        <TbLayoutList size="1.25rem" strokeWidth={3} />
        <span>List maker</span>
      </BigPill>

      <BigPill className={styles.BigPill} color="blue" href="/tiermaker">
        <LuBarChartHorizontal size="1.25rem" strokeWidth={3} />
        <span>Tier maker</span>
      </BigPill>
    </div>
  )
}
