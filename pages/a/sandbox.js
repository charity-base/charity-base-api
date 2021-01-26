import { useEffect, useRef } from "react"
import GraphiQL from "graphiql"
import Head from "next/head"

const DEFAULT_QUERY = `
{
  CHC {
    getCharities(filters: {}) {
      count
    }
  }
}
`

function graphQLFetcher(graphQLParams) {
  console.log(`Fetching '${process.env.NEXT_PUBLIC_CB_SANDBOX_API_KEY}'`)
  return fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Apikey ${process.env.NEXT_PUBLIC_CB_SANDBOX_API_KEY}`,
    },
    body: JSON.stringify(graphQLParams),
  }).then((res) => res.json())
}

export default function Sandbox() {
  const sandbox = useRef(null)

  useEffect(() => {
    // https://github.com/graphql/graphiql/issues/770
    setTimeout(() => sandbox.current.refresh(), 300)
  }, [])

  return (
    <div className="h-screen pt-16">
      <Head>
        <title>CharityBase Sandbox</title>
        <meta property="og:title" content="CharityBase Sandbox" key="title" />
        <meta name="Description" content="CharityBase GraphiQL API Sandbox" />
        <link
          href="https://unpkg.com/graphiql@0.17.5/graphiql.min.css"
          rel="stylesheet"
        />
      </Head>
      <GraphiQL
        ref={sandbox}
        fetcher={graphQLFetcher}
        defaultQuery={DEFAULT_QUERY}
      />
    </div>
  )
}
