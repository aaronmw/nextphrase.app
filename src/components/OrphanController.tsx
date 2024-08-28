'use client'

import { ComponentProps, useEffect, useRef } from 'react'
import { useIsClient, useMediaQuery } from 'usehooks-ts'

export function OrphanController({
  children,
  ...otherProps
}: ComponentProps<'div'>) {
  const isClient = useIsClient()
  const isPortrait = useMediaQuery('(orientation: portrait)') && isClient
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = innerRef.current

    if (isPortrait || !element || element.dataset.orphanControlled === 'true') {
      if (element && isPortrait) {
        element.innerHTML = element.innerHTML.replace(/&nbsp;/g, ' ')
      }
      return
    }

    element.dataset.orphanControlled = 'true'

    const pieces = element.innerHTML.split(' ')

    if (pieces.length < 2) {
      return
    }

    element.innerHTML = `${pieces.slice(0, pieces.length - 1).join(' ')}${String.fromCharCode(160)}${pieces.slice(-1)}`

    element.dataset.orphanControlled = 'true'
  }, [isPortrait])

  return (
    <div
      ref={innerRef}
      {...otherProps}
    >
      {children}
    </div>
  )
}
