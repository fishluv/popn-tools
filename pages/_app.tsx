import "../styles/globals.scss"
import type { AppProps } from "next/app"
import NextAdapterPages from "next-query-params/pages"
import { QueryParamProvider } from "use-query-params"
import queryString from "query-string"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryParamProvider
      adapter={NextAdapterPages}
      options={{
        searchStringToObject: queryString.parse,
        objectToSearchString: queryString.stringify,
      }}
    >
      <Component {...pageProps} />
    </QueryParamProvider>
  )
}

export default MyApp
