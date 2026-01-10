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
]

export default function BrowsePage({
  songsByDebut,
}: {
  songsByDebut: Partial<Record<string, RawSong[]>>
}) {
  return (
    <div id="app" className={styles.BrowsePage}>
      {DEBUTS.map(({ id: debutId, name: debutName }) => {
        const sortedSongs = songsByDebut[debutId] ?? []
        return (
          <section key={debutId}>
            <h2>{debutName}</h2>
            {sortedSongs.map(({ slug, title }) => {
              return <span key={slug}>{title}</span>
            })}
          </section>
        )
      })}
    </div>
  )
}
