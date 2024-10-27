'use client'

import { RefObject, useEffect, useState } from 'react'

interface UseIsScrolledArgs {
  scrollingElementRef?: RefObject<HTMLElement>
}

export function useIsScrolled({ scrollingElementRef }: UseIsScrolledArgs = {}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [canScroll, setCanScroll] = useState(false)

  useEffect(() => {
    function handleScroll() {
      const element = scrollingElementRef?.current || document.body
      setIsScrolled(element.scrollTop > 50)
      setCanScroll(element.scrollHeight > element.clientHeight)
    }

    const element = scrollingElementRef?.current || document.body
    element.addEventListener('scroll', handleScroll)

    const interval = setInterval(() => {
      handleScroll()
    }, 1000)

    handleScroll()

    return () => {
      element.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [scrollingElementRef])

  return { isScrolled, canScroll }
}
