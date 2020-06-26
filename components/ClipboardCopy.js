import { useState, useEffect } from "react"
import copy from "copy-to-clipboard"

export default function ({ text }) {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (count > 0) {
      setOpen(true)
      const id = setTimeout(() => {
        setOpen(false)
      }, 1200)

      return () => clearTimeout(id)
    }
  }, [count])

  return (
    <div className="absolute top-0 right-0 m-2 flex items-center space-x-2">
      <div
        className={`bg-black bg-opacity-75 text-white py-1 px-2 rounded transform origin-right transition duration-300 ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        copied
      </div>
      <button
        className="bg-black bg-opacity-75 text-gray-300 hover:text-white focus:text-white focus:outline-none border border-gray-800 p-3 rounded-full"
        aria-label="Copy to Clipboard"
        title="Copy to Clipboard"
        onClick={() => {
          try {
            copy(text)
            setCount((x) => x + 1)
          } catch (e) {
            console.log("Error copying text")
          }
        }}
      >
        <svg
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          width="24"
          height="24"
        >
          <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
        </svg>
      </button>
    </div>
  )
}
