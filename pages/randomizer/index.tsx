import Head from "next/head"
import RandomizerApp from "../../components/Randomizer/RandomizerApp"

export default function Randomizer() {
  return (
    <>
      <Head>
        <title>{"Randomizer • Pop'n Tools"}</title>
        <meta name="description" content="Draw random songs with advanced filtering" />
      </Head>
      <RandomizerApp />
    </>
  )
}
