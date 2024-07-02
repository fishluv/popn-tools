import "../styles/globals.scss"
import type { AppProps } from "next/app"
import NextAdapterPages from "next-query-params/pages"
import { QueryParamProvider } from "use-query-params"
import queryString from "query-string"
import { Toaster } from "react-hot-toast"

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
      <Toaster position="bottom-center" />
    </QueryParamProvider>
  )
}

export default MyApp
