import cx from "classnames"
import { RawSong } from "../../pages/songlist"
import styles from "./SongListPage.module.scss"
import Link from "next/link"

const DEBUTS: { id: string; name: string; name2?: string }[] = [
  { id: "28", name: "Jam&Fizz" },
  { id: "27", name: "UniLab" },
  { id: "26", name: "解明リドルズ", name2: "Kaimei Riddles" },
  { id: "25", name: "peace" },
  { id: "24", name: "うさぎと猫と少年の夢", name2: "Usaneko" },
  { id: "23", name: "éclale" },
  { id: "22", name: "ラピストリア", name2: "Lapistoria" },
  { id: "21", name: "Sunny Park" },
  { id: "20", name: "20 fantasia" },
  { id: "19", name: "19 TUNE STREET" },
  { id: "18", name: "18 せんごく列伝", name2: "Sengoku Retsuden" },
  { id: "17", name: "17 THE MOVIE" },
  { id: "16", name: "16 PARTY♪" },
  { id: "15", name: "15 ADVENTURE" },
  { id: "14", name: "14 FEVER!" },
  { id: "13", name: "13 カーニバル", name2: "Carnival" },
  { id: "12", name: "12 いろは", name2: "Iroha" },
  { id: "11", name: "11" },
  { id: "10", name: "10" },
  { id: "9", name: "9" },
  { id: "8", name: "8" },
  { id: "7", name: "7" },
  { id: "6", name: "6" },
  { id: "5", name: "5" },
  { id: "4", name: "4" },
  { id: "3", name: "3" },
  { id: "2", name: "2" },
  { id: "1", name: "1" },
  { id: "eemall", name: "eeMALL" },
  { id: "cslively", name: "Lively" },
  { id: "csutacchi", name: "うたっち", name2: "Utacchi" },
  { id: "cspmp2", name: "portable 2" },
  { id: "cspmp", name: "portable" },
  { id: "cs14", name: "14 FEVER! CS" },
  { id: "cs13", name: "13 カーニバル CS", name2: "Carnival" },
  { id: "cs12", name: "12 いろは CS", name2: "Iroha" },
  { id: "cs11", name: "11 CS" },
  { id: "cs10", name: "10 CS" },
  { id: "cs9", name: "9 CS" },
  { id: "cs8", name: "8 CS" },
  { id: "cs7", name: "7 CS" },
  { id: "csbest", name: "Best Hits!" },
  { id: "cs6", name: "6 CS" },
  { id: "cs5", name: "5 CS" },
  { id: "cs4", name: "4 CS" },
  { id: "cs3", name: "3 CS" },
  { id: "cs2", name: "2 CS" },
  { id: "cs1", name: "1 CS" },
]

function uniqueTitle(title: string, slug: string, debutId: string) {
  if (slug.endsWith("-live") && debutId == "8") {
    return `${title} (LIVE)`
  }
  if (slug.endsWith("-long")) {
    return `${title} (LONG)`
  }
  if (slug.endsWith("-ura")) {
    return `${title} (URA)`
  }
  if (slug.endsWith("-upper")) {
    return `${title} (UPPER)`
  }
  return title
}

export default function SongListPage({
  songsByDebut,
}: {
  songsByDebut: Partial<Record<string, RawSong[]>>
}) {
  return (
    <div id="app" className={styles.SongListPage}>
      {/* lol */}
      <style>{"body { background-image: none; }"}</style>

      {DEBUTS.map(({ id: debutId, name: debutName, name2: debutSubtitle }) => {
        const sortedSongs = (songsByDebut[debutId] ?? []).sort((a, b) =>
          a.fwTitle.localeCompare(b.fwTitle),
        )

        return (
          <section key={debutId} className={styles.section}>
            <div className={styles.header}>
              <a className={styles.title} href={`#${debutId}`}>
                <span id={debutId}>{debutName}</span>
              </a>

              {debutSubtitle && (
                <span className={styles.subtitle}>{`(${debutSubtitle})`}</span>
              )}
            </div>

            {sortedSongs.map(({ slug, title, genre, rGenre, e, n, h, ex }) => {
              return (
                <div key={slug} className={styles.songRow}>
                  <div className={styles.titleGenre}>
                    <p className={styles.title}>
                      {uniqueTitle(title, slug, debutId)}
                    </p>
                    {title !== genre && (
                      <p className={styles.genre}>
                        &nbsp;&nbsp;&nbsp;&nbsp;{rGenre}
                      </p>
                    )}
                  </div>

                  <span className={styles.level}>
                    {e !== null && (
                      <Link href={`/chart/${slug}/e`} target="_blank">
                        <span
                          className={cx(styles.pill, styles.compact, styles.e)}
                        >
                          {e}
                        </span>
                      </Link>
                    )}
                  </span>

                  <span className={styles.level}>
                    {n !== null && (
                      <Link href={`/chart/${slug}/n`} target="_blank">
                        <span
                          className={cx(styles.pill, styles.compact, styles.n)}
                        >
                          {n}
                        </span>
                      </Link>
                    )}
                  </span>

                  <span className={styles.level}>
                    {h !== null && (
                      <Link href={`/chart/${slug}/h`} target="_blank">
                        <span
                          className={cx(styles.pill, styles.compact, styles.h)}
                        >
                          {h}
                        </span>
                      </Link>
                    )}
                  </span>

                  <span className={styles.level}>
                    {ex !== null && (
                      <Link href={`/chart/${slug}/ex`} target="_blank">
                        <span
                          className={cx(styles.pill, styles.compact, styles.ex)}
                        >
                          {ex}
                        </span>
                      </Link>
                    )}
                  </span>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}
