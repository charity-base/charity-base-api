import PropTypes from "prop-types"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAppBar } from "hooks"

const NavLink = ({ href, label }) => {
  const { pathname } = useRouter()
  const bgClassName = pathname === href ? "bg-gray-200" : "hover:bg-gray-100"
  return (
    <Link href={href}>
      <a
        className={`py-1 px-2 transition-colors duration-300 rounded ${bgClassName}`}
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
        <NavLink href="/chc" label="Search" />
        <NavLink href="/docs" label="API" />
        <NavLink href="/about" label="About" />
      </section>
    </header>
  )
}

export default AppBar
