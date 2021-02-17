// import PropTypes from "prop-types"
import Link from "next/link"
// import { useRouter } from "next/router"
import { useAppBar } from "hooks"

// const NavLink = ({ href, label, secondary, matchPath }) => {
//   const { pathname } = useRouter()
//   const active = pathname.indexOf(matchPath || href) === 0
//   const textClassName = active ? "text-black" : "text-gray-600 hover:text-black"
//   const bgClassName = active ? "bg-gray-200" : "hover:bg-gray-100"
//   return (
//     <Link href={href}>
//       <a
//         className={`inline-block transition-colors duration-300 rounded ${textClassName} ${
//           secondary ? `block` : `py-1 px-2 ${bgClassName}`
//         }`}
//       >
//         {label}
//       </a>
//     </Link>
//   )
// }
// NavLink.propTypes = {
//   href: PropTypes.string.isRequired,
//   label: PropTypes.string.isRequired,
// }

function ExternalLinkIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className || "w-5 h-5"}
    >
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  )
}

const AppBar = () => {
  const offset = useAppBar(() => 64, 1023) // values correspond to h-16 and device < lg
  return (
    <header
      className="fixed top-0 left-0 right-0 text-gray-700 z-50 h-16 shadow-lg blur bg-white bg-opacity-75 flex justify-between items-center px-4 md:px-8 xl:px-12"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <Link href="/">
        <a className="text-xl tracking-wider opacity-75 hover:opacity-100 transition-opacity duration-300 font-medium p-1">
          CharityBase
        </a>
      </Link>
      <section className="inline-flex items-center space-x-8" role="navigation">
        {/* <NavLink href="/chc" label="Search" /> */}
        {/* <NavLink href="/pricing" label="Pricing" /> */}
        {/* <NavLink href="/about" label="About" /> */}
        {/* <div className="relative group">
          <NavLink href="/a/docs" label="API" matchPath="/a/" />
          <div className="absolute right-0 transition duration-100 opacity-0 transform origin-top-right scale-0 group-hover:scale-100 group-hover:opacity-100">
            <div className="bg-white shadow-lg border border-gray-200 mt-2 px-5 py-4 space-y-4 rounded">
              <NavLink href="/a/docs" label="Docs" secondary />
              <NavLink href="/api/graphql" label="Playground" secondary />
            </div>
          </div>
        </div> */}
        <a
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          target="_blank"
          rel="noreferrer noopener"
          href="https://search.charitybase.uk/api-portal/keys"
        >
          <div>API Keys</div>
          <ExternalLinkIcon />
        </a>
        <a
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          target="_blank"
          rel="noreferrer noopener"
          href={`${process.env.NEXT_PUBLIC_URL}/api/graphql`}
        >
          <div>Playground</div>
          <ExternalLinkIcon />
        </a>
      </section>
      <style jsx>{`
        .blur {
          backdrop-filter: saturate(180%) blur(5px);
        }
      `}</style>
    </header>
  )
}

export default AppBar
