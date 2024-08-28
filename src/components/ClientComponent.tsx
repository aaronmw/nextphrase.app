'use client'

import { ReactNode, useEffect, useState } from 'react'

interface ClientComponentProps {
  children: ReactNode
}

export function ClientComponent({ children }: ClientComponentProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return !isClient ? null : <>{children}</>
}
