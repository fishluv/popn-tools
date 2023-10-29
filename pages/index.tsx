import Head from "next/head"
import Home from "../components/Home"

export async function getStaticProps() {
  return { props: { bodyClassName: "Home" } }
}

export default function Index() {
  return (
    <>
      <Head>
        <title>Pop&apos;n Tools</title>
      </Head>
      <Home />
    </>
  )
}
