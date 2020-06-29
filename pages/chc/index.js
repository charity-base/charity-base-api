import PropTypes from "prop-types"
import Head from "next/head"
import getCharitiesList from "web-lib/getCharitiesList"
import CharityList from "components/CharityList"
import Filters from "components/filters"

export default function ({ count, list, filters }) {
  return (
    <div className="max-w-screen-xl mx-auto flex px-2 sm:px-4 md:px-8">
      <Head>
        <title>CharityBase Search</title>
        <meta property="og:title" content="CharityBase Search" key="title" />
        <meta name="Description" content="CharityBase England & Wales Search" />
      </Head>
      <aside className="flex-shrink-0 py-24 pr-8 xl:pr-16 sticky top-0 h-screen overflow-auto">
        <Filters {...filters} />
      </aside>
      <div className="py-24 w-full">
        <div className="mb-4 text-right text-sm text-gray-700 font-semibold">
          {count} charities
        </div>
        <CharityList charities={list} />
      </div>
      <aside className="flex-shrink-0 py-24 pl-8 xl:pl-16 sticky top-0 h-screen overflow-auto">
        <div>Tabs go heree go here go here</div>
        <div>Tabs go heree go here go here</div>
        <div>Tabs go heree go here go here</div>
        <div>Tabs go heree go here go here</div>
        <div>Tabs go heree go here go here</div>
        <div>Tabs go heree go here go here</div>
      </aside>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  let filters
  try {
    filters = JSON.parse(query.filters)
  } catch (e) {
    filters = {}
  }
  const { count, list } = await getCharitiesList({
    filters,
    skip: 0,
  })
  return {
    props: {
      filters,
      count,
      list,
    },
  }
}
