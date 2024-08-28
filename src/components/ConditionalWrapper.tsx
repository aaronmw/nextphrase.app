import { ReactNode } from 'react'

interface ConditionalWrapperProps {
  children: ReactNode
  condition: boolean
  wrapper: (children: ReactNode) => ReactNode
}

function ConditionalWrapper({
  children,
  condition,
  wrapper,
}: ConditionalWrapperProps) {
  return <>{condition ? wrapper(children) : children}</>
}

export { ConditionalWrapper }
