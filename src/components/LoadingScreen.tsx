import { Icon } from '@/components/Icon'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface LoadingScreenProps extends Omit<ComponentProps<'div'>, 'children'> {}

export function LoadingScreen({
  className,
  ...otherProps
}: LoadingScreenProps) {
  return (
    <div
      className={twMerge(
        `
          fixed
          inset-0
          z-[1000]
          flex
          items-center
          justify-center
          bg-white
        `,
        className,
      )}
      {...otherProps}
    >
      <Icon
        className="animate-spin"
        name="loader"
      />
    </div>
  )
}
