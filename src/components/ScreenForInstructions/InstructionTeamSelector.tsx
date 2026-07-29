'use client'

import { TeamSelector } from '@/components/TeamSelector'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

type Team = 'A' | 'B'

const TOUCH_ENTER_DURATION = 0.12
const TOUCH_DRAG_DURATION = 0.25
const TOUCH_EXIT_DURATION = 0.12

interface TouchGeometry {
  teamA: number
  teamB: number
  y: number
}

export interface InstructionTeamSelectorHandle {
  animatePass: (team: Team, onToggle?: () => void) => void
  hide: (immediate?: boolean) => void
  reset: (team?: Team) => void
  show: (immediate?: boolean) => void
}

function ignoreTeamSelection() {}

export const InstructionTeamSelector =
  forwardRef<InstructionTeamSelectorHandle>(
    function InstructionTeamSelector(_, ref) {
      const [activeTeam, setActiveTeam] = useState<Team>('A')
      const activeTeamRef = useRef<Team>('A')
      const rootRef = useRef<HTMLDivElement>(null)
      const selectorRef = useRef<HTMLDivElement>(null)
      const touchRef = useRef<HTMLSpanElement>(null)
      const touchTimelineRef = useRef<gsap.core.Timeline | null>(null)

      function getTouchGeometry(): TouchGeometry | null {
        const root = rootRef.current
        const selector = selectorRef.current
        const touch = touchRef.current
        const rail = selector?.querySelector<HTMLElement>(
          '[data-team-selector-rail]',
        )
        const handle = selector?.querySelector<HTMLElement>(
          '[data-team-selector-handle]',
        )

        if (!(root && touch && rail && handle)) return null

        const rootBounds = root.getBoundingClientRect()
        const railBounds = rail.getBoundingClientRect()
        const handleBounds = handle.getBoundingClientRect()
        const touchBounds = touch.getBoundingClientRect()
        const touchHalfWidth = touchBounds.width / 2
        const touchHalfHeight = touchBounds.height / 2
        const handleHalfWidth = handleBounds.width / 2
        const handleHalfHeight = handleBounds.height / 2

        return {
          teamA:
            railBounds.left -
            rootBounds.left +
            handleHalfWidth -
            touchHalfWidth +
            touchBounds.width * 0.5,
          teamB:
            railBounds.right -
            rootBounds.left -
            handleHalfWidth -
            touchHalfWidth +
            touchBounds.width * 0.5,
          y:
            handleBounds.top -
            rootBounds.top -
            touchHalfHeight +
            handleHalfHeight +
            touchBounds.height * 0.75,
        }
      }

      function reset(team: Team = 'A') {
        const root = rootRef.current
        const touch = touchRef.current

        touchTimelineRef.current?.kill()
        touchTimelineRef.current = null
        activeTeamRef.current = team
        setActiveTeam(team)

        if (root) {
          gsap.killTweensOf(root)
          gsap.set(root, { autoAlpha: 0, y: 8 })
        }

        if (touch) {
          gsap.killTweensOf(touch)
          gsap.set(touch, { autoAlpha: 0, scale: 0.82, x: 0, y: 0 })
        }
      }

      useImperativeHandle(ref, () => ({
        animatePass(team: Team, onToggle?: () => void) {
          const touch = touchRef.current
          const geometry = getTouchGeometry()
          const currentTeam = activeTeamRef.current

          if (!(touch && geometry) || currentTeam === team) return

          const startX = currentTeam === 'A' ? geometry.teamA : geometry.teamB
          const endX = team === 'A' ? geometry.teamA : geometry.teamB

          touchTimelineRef.current?.kill()
          touchTimelineRef.current = gsap
            .timeline()
            .set(touch, {
              autoAlpha: 0,
              scale: 0.82,
              x: startX,
              y: geometry.y - 3,
            })
            .to(touch, {
              autoAlpha: 1,
              duration: TOUCH_ENTER_DURATION,
              ease: 'power2.out',
              scale: 1,
              y: geometry.y,
            })
            .call(() => {
              activeTeamRef.current = team
              setActiveTeam(team)
              onToggle?.()
            })
            .to(touch, {
              duration: TOUCH_DRAG_DURATION,
              ease: 'power2.inOut',
              x: endX,
            })
            .to(touch, {
              autoAlpha: 0,
              duration: TOUCH_EXIT_DURATION,
              ease: 'power1.out',
              scale: 0.9,
              y: geometry.y + 3,
            })
        },
        hide(immediate = false) {
          const root = rootRef.current
          const touch = touchRef.current

          touchTimelineRef.current?.kill()
          touchTimelineRef.current = null

          if (touch) {
            gsap.killTweensOf(touch)
            gsap.set(touch, { autoAlpha: 0 })
          }

          if (!root) return

          gsap.killTweensOf(root)

          if (immediate) {
            gsap.set(root, { autoAlpha: 0, y: 8 })
            return
          }

          gsap.to(root, {
            autoAlpha: 0,
            duration: 0.22,
            ease: 'power2.in',
            y: 8,
          })
        },
        reset,
        show(immediate = false) {
          const root = rootRef.current

          if (!root) return

          gsap.killTweensOf(root)

          if (immediate) {
            gsap.set(root, { autoAlpha: 1, y: 0 })
            return
          }

          gsap.to(root, {
            autoAlpha: 1,
            duration: 0.25,
            ease: 'power2.out',
            y: 0,
          })
        },
      }))

      useGSAP(
        () => {
          reset()

          return () => {
            touchTimelineRef.current?.kill()
            touchTimelineRef.current = null
          }
        },
        { scope: rootRef },
      )

      return (
        <div
          ref={rootRef}
          aria-hidden="true"
          className="
        pointer-events-none
        relative
        h-[2.25rem]
        w-[min(82vw,18rem)]
        shrink-0
        opacity-0
      "
          data-instruction-team-selector
          inert
        >
          <TeamSelector
            ref={selectorRef}
            activeTeam={activeTeam}
            className="
          pointer-events-none
          absolute
          inset-0
        "
            onSelectTeam={ignoreTeamSelection}
          />

          <span
            ref={touchRef}
            className="
          bg-neutralColor-100/80
          pointer-events-none
          absolute
          top-0
          left-0
          z-20
          size-5
          rounded-full
          opacity-0
          drop-shadow-md
          backdrop-blur-sm
        "
            data-instruction-team-selector-touch
          />
        </div>
      )
    },
  )
