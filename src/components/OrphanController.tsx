import { PreventOrphans } from '@/components/PreventOrphans'
import { ComponentProps } from 'react'

export function OrphanController({
  children,
  ...otherProps
}: ComponentProps<'div'>) {
  return (
    <div {...otherProps}>
      <PreventOrphans>{children}</PreventOrphans>
    </div>
  )
}
