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
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
          rel="stylesheet"
        /> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,400;0,700;1,400&amp;display=swap"
          rel="stylesheet"
        />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&amp;display=swap"
          rel="stylesheet"
        /> */}
      </Head>
      <Component {...pageProps} />
    </Fragment>
  )
}
