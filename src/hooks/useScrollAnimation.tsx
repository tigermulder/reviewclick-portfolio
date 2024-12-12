import { useEffect, useState } from "react"

const useScrollAnimation = () => {
  const [popUpOffsetY, setPopUpOffsetY] = useState(-61)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      let scrollPosition = window.scrollY
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const clampedScrollPosition = Math.max(
        0,
        Math.min(scrollPosition, maxScroll)
      )
      let newOffsetY = -61
      if (clampedScrollPosition <= 100) {
        newOffsetY = -61 + (clampedScrollPosition / 100) * 61
      } else {
        newOffsetY = 0
      }
      setPopUpOffsetY(newOffsetY)
      if (scrollPosition < 0) {
        const scaleFactor = 1 - scrollPosition / 400
        setScale(scaleFactor)
      } else {
        setScale(1)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return { popUpOffsetY, scale }
}

export default useScrollAnimation
