const DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://charitybase.uk"
    : "http://localhost:3000"

export default function gqlFetcher(params) {
  const url =
    typeof window === "undefined" ? `${DOMAIN}/api/graphql` : "/api/graphql"

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Apikey ${process.env.NEXT_PUBLIC_CB_SANDBOX_API_KEY}`,
    },
    body: JSON.stringify(params),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error("FETCH ERROR (probably your network)")
      throw err
    })
    .then(({ data, errors }) => {
      if (errors) {
        console.error("GQL QUERY ERRORS")
        throw errors
      }
      return data
    })
}
