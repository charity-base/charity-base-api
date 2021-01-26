import PropTypes from "prop-types"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAppBar } from "hooks"

const NavLink = ({ href, label, secondary, matchPath }) => {
  const { pathname } = useRouter()
  const active = pathname.indexOf(matchPath || href) === 0
  const textClassName = active ? "text-black" : "text-gray-600 hover:text-black"
  const bgClassName = active ? "bg-gray-200" : "hover:bg-gray-100"
  return (
    <Link href={href}>
      <a
        className={`inline-block transition-colors duration-300 rounded ${textClassName} ${
          secondary ? `block` : `py-1 px-2 ${bgClassName}`
        }`}
      >
        {label}
      </a>
    </Link>
  )
}
NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
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
      <section className="inline-flex items-center space-x-4" role="navigation">
        {/* <NavLink href="/chc" label="Search" /> */}
        <NavLink href="/about" label="About" />
        <div className="relative group">
          <NavLink href="/a/docs" label="API" matchPath="/a/" />
          <div className="absolute right-0 transition duration-100 opacity-0 transform origin-top-right scale-0 group-hover:scale-100 group-hover:opacity-100">
            <div className="bg-white shadow-lg border border-gray-200 mt-2 px-5 py-4 space-y-4 rounded">
              <NavLink href="/a/docs" label="Docs" secondary />
              <NavLink href="/a/sandbox" label="Sandbox" secondary />
            </div>
          </div>
        </div>
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
