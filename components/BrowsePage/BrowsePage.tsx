import { RawSong } from "../../pages/browse"
import styles from "./BrowsePage.module.scss"

const DEBUTS: { id: string; name: string }[] = [
  { id: "28", name: "Jam&Fizz" },
  { id: "27", name: "UniLab" },
  { id: "26", name: "解明リドルズ (Kaimei Riddles)" },
  { id: "25", name: "peace" },
  { id: "24", name: "うさぎと猫と少年の夢 (Usaneko)" },
  { id: "23", name: "éclale" },
  { id: "22", name: "ラピストリア (Lapistoria)" },
  { id: "21", name: "Sunny Park" },
  { id: "20", name: "20 fantasia" },
  { id: "19", name: "19 TUNE STREET" },
  { id: "18", name: "18 せんごく列伝 (Sengoku Retsuden)" },
  { id: "17", name: "17 THE MOVIE" },
  { id: "16", name: "16 PARTY♪" },
  { id: "15", name: "15 ADVENTURE" },
  { id: "14", name: "14 FEVER!" },
  { id: "13", name: "13 カーニバル (Carnival)" },
  { id: "12", name: "12 いろは (Iroha)" },
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
  { id: "csutacchi", name: "うたっち (Utacchi)" },
  { id: "cspmp2", name: "portable 2" },
  { id: "cspmp", name: "portable" },
  { id: "cs14", name: "14 FEVER! CS" },
  { id: "cs13", name: "13 カーニバル (Carnival) CS" },
  { id: "cs12", name: "12 いろは (Iroha) CS" },
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

export default function BrowsePage({
  songsByDebut,
}: {
  songsByDebut: Partial<Record<string, RawSong[]>>
}) {
  return (
    <div id="app" className={styles.BrowsePage}>
      {DEBUTS.map(({ id: debutId, name: debutName }) => {
        const sortedSongs = (songsByDebut[debutId] ?? []).sort((a, b) =>
          a.fwTitle.localeCompare(b.fwTitle),
        )

        return (
          <section key={debutId}>
            <a href={`#${debutId}`}>
              <h2 id={debutId}>{debutName}</h2>
            </a>
            {sortedSongs.map(({ slug, title, e, n, h, ex }) => {
              return (
                <div key={slug} className={styles.songRow}>
                  <span className={styles.title}>{title}</span>
                  <span className={styles.level}>{e}</span>
                  <span className={styles.level}>{n}</span>
                  <span className={styles.level}>{h}</span>
                  <span className={styles.level}>{ex}</span>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}
