import { Fragment } from "react"
import Head from "next/head"
import "index.css"

export default function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
        <title>CharityBase</title>
        <meta property="og:title" content="CharityBase" key="title" />
        <meta name="Description" content="The database of charities" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </Fragment>
  )
}
