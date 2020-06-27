import Head from "next/head"
import getCharitiesList from "web-lib/getCharitiesList"

export default function ({ count, list }) {
  return (
    <div className="max-w-5xl mx-auto flex px-2 sm:px-4 md:px-8">
      <Head>
        <title>CharityBase Search</title>
        <meta property="og:title" content="CharityBase Search" key="title" />
        <meta name="Description" content="CharityBase England & Wales Search" />
      </Head>
      <aside className="flex-shrink-0 py-24 pr-8 xl:pr-16 sticky top-0 h-screen overflow-auto bg-gray-800">
        Filters section
      </aside>
      <div className="bg-gray-300 py-24">
        Results section
        <div>Counted {count} charities</div>
        <ul>
          {list.map((x) => (
            <li key={x.id}>{x.id}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const filters = query.filters || {}
  const { count, list } = await getCharitiesList({
    filters,
    skip: 0,
  })
  return {
    props: {
      count,
      list,
    },
  }
}
