import Head from "next/head"
import { useRouter } from "next/router"
import getCharity from "web-lib/getCharity"

export default function Charity({ charity }) {
  const router = useRouter()
  const { chcId } = router.query
  return (
    <div className="py-24 text-center">
      <Head>
        <title key="title">{`Charity ${chcId}`}</title>
        <meta key="og:title" property="og:title" content={`Charity ${chcId}`} />
      </Head>
      <h1 className="text-4xl font-semibold">CharityPage</h1>
      {router.isFallback ? (
        <div>Fetching on server...</div>
      ) : (
        <div>{JSON.stringify(charity)}</div>
      )}
    </div>
  )
}

export async function getStaticProps({ params }) {
  const { chcId } = params
  const { list } = await getCharity({ id: chcId })

  return {
    props: {
      charity: list[0] || null,
    },
  }
}

export async function getStaticPaths() {
  return {
    paths: [], // do not pre-render any charity pages at build time
    fallback: true,
  }
}
