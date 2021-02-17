export default function gqlFetcher(params) {
  // use relative url client side
  const url =
    typeof window === "undefined"
      ? `${process.env.NEXT_PUBLIC_URL}/api/graphql`
      : "/api/graphql"

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
