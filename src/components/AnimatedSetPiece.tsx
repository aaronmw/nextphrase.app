'use client'

import { useAnimation } from '@/lib/useAnimation'
import { usePrevious } from '@/lib/usePrevious'
import { ComponentProps, ElementType, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

type AnimatedSetPieceProps<T extends ElementType = 'div'> = Omit<
  ComponentProps<T>,
  'poses'
> & {
  as?: T
  poses: (gsap.TweenVars & {
    isStriking: boolean
  })[]
}

export function AnimatedSetPiece<T extends ElementType = 'div'>({
  children,
  as,
  className,
  poses,
  ...otherProps
}: AnimatedSetPieceProps<T>) {
  const { animate } = useAnimation()
  const previousPoses = usePrevious(poses)
  const Component = String(as || 'div') as ElementType

  useEffect(() => {
    poses.map(
      (
        { isStriking, label, poseTransition, unPoseTransition, ...rest },
        poseIndex,
      ) => {
        if (isStriking === previousPoses?.[poseIndex]?.isStriking) return

        const runBackwards = !isStriking

        animate({
          transitionDescriptors: [
            [
              `.js-animated-set-piece`,
              runBackwards
                ? (unPoseTransition ?? poseTransition)
                : poseTransition,
            ],
          ],
          runBackwards: unPoseTransition ? false : runBackwards,
          ...rest,
        })
      },
    )
  }, [poses])

  return (
    <Component
      className={twMerge(
        `
          js-animated-set-piece
          hidden
        `,
        className,
      )}
      {...otherProps}
    >
      {children}
    </Component>
  )
}
