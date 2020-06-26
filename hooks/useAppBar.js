import { useState, useEffect, useRef } from "react"

const DEFAULT_INNER_WIDTH = 1280
const DEFAULT_APP_BAR_HEIGHT = 64

const useAppBar = (getHeight, maxWidth, parallax) => {
  const prevScroll = useRef(0)
  const [offset, setOffset] = useState(0)

  const [{ innerWidth, appBarHeight }, setDimensions] = useState({
    innerWidth: DEFAULT_INNER_WIDTH,
    appBarHeight: DEFAULT_APP_BAR_HEIGHT,
  })

  useEffect(() => {
    if (!window.requestAnimationFrame) {
      return () => {}
    }

    function onThrottledScroll() {
      const scroll = window.pageYOffset
      setOffset((prevOffset) => {
        if (typeof maxWidth === "number" && innerWidth > maxWidth) {
          return 0
        }
        if (scroll < 0) {
          return 0
        }
        const diff = (scroll - prevScroll.current) * (parallax || 1)
        const offset =
          diff > 0
            ? Math.max(prevOffset - diff, -appBarHeight)
            : Math.min(prevOffset - diff, 0)
        return offset
      })
      prevScroll.current = scroll
    }

    let ticking = false
    function onScroll() {
      if (ticking) return
      window.requestAnimationFrame(function () {
        onThrottledScroll()
        ticking = false
      })
      ticking = true
    }

    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [innerWidth, appBarHeight, maxWidth, parallax])

  useEffect(() => {
    function onResize() {
      setDimensions({
        innerWidth: window.innerWidth,
        appBarHeight: getHeight(),
      })
    }

    window.addEventListener("resize", onResize)
    onResize()

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return offset
}

export default useAppBar
