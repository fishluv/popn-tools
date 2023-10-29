import { useEffect } from "react"
import "../styles/globals.scss"
import type { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (pageProps.bodyClassName) {
      document.body.className = pageProps.bodyClassName
    }
  })

  return <Component {...pageProps} />
}

export default MyApp
