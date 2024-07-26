import Head from "next/head"
import Home from "../components/Home"

export default function Index() {
  return (
    <>
      <Head>
        <title>{`Pop'n Tools`}</title>
      </Head>
      <Home />
    </>
  )
}
