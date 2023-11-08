import { useEffect } from "react"
import "../styles/globals.scss"
import type { AppProps } from "next/app"
import NextAdapterPages from "next-query-params/pages"
import { QueryParamProvider } from "use-query-params"

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (pageProps.bodyClassName) {
      document.body.className = pageProps.bodyClassName
    }
  })

  return (
    <QueryParamProvider adapter={NextAdapterPages}>
      <Component {...pageProps} />
    </QueryParamProvider>
  )
}

export default MyApp
