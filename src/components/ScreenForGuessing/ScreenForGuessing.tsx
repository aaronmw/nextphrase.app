'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Icon } from '@/components/Icon'
import { PhraseFlipper } from '@/components/PhraseFlipper'
import { ScreenContainer } from '@/components/ScreenContainer'
import { TeamDragSwitch } from '@/components/TeamDragSwitch'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { teamAColor, teamBColor } from '../../../tailwind.config'
import { classNames } from './classNames'

export function ScreenForGuessing() {
  const lightsContainerRef = useRef<HTMLButtonElement>(null)
  const flashingLightElementRef = useRef<HTMLDivElement>(null)
  const { state, dispatch, sounds } = useAppContext()
  const {
    currentRoundAccelerationStartTime,
    currentRoundEndTime,
    currentRoundStartTime,
    tickRate,
    acceleratedTickRate,
    teamHoldingPhone,
  } = state

  useGSAP(
    () => {
      const lightsContainer = lightsContainerRef.current

      if (
        !(
          lightsContainer &&
          currentRoundAccelerationStartTime &&
          currentRoundEndTime &&
          currentRoundStartTime
        )
      ) {
        return
      }

      const rotatingLightTimeline = gsap.timeline({ repeat: -1 })
      const spinningIconTimeline = gsap.timeline({ repeat: -1 })
      const flashingLightTimeline = gsap.timeline({ repeat: -1 })
      const timeToAcceleration = currentRoundAccelerationStartTime - Date.now()
      const timeToEnd = currentRoundEndTime - Date.now()

      sounds.playSound('bonk', tickRate)

      rotatingLightTimeline.fromTo(
        `.js-rotating-light`,
        { rotate: 0 },
        {
          duration: tickRate * 2,
          rotate: 360,
          ease: 'none',
        },
      )

      spinningIconTimeline.fromTo(
        `.js-spinning-icon`,
        { rotate: 360 },
        {
          duration: tickRate * 2,
          rotate: 0,
          ease: 'none',
        },
      )

      flashingLightTimeline
        .to(`.js-flashing-light`, { opacity: 1, duration: 0.1 })
        .to(`.js-flashing-light`, { opacity: 0, duration: 0.1 })
        .to(`.js-flashing-light`, { opacity: 1, duration: 0.1 })
        .to(`.js-flashing-light`, { opacity: 0, duration: 0.1 })
        .to(`.js-flashing-light`, { opacity: 0, duration: tickRate * 2 - 0.4 })

      const accelerationTimeout = setTimeout(
        accelerateAnimation,
        timeToAcceleration,
      )

      const endTimeout = setTimeout(endAnimation, timeToEnd)

      function accelerateAnimation() {
        sounds.playSound('bonk', acceleratedTickRate)

        rotatingLightTimeline.clear()
        rotatingLightTimeline.fromTo(
          `.js-rotating-light`,
          { rotate: 0 },
          {
            duration: acceleratedTickRate * 2,
            rotate: 360,
            ease: 'none',
          },
        )

        spinningIconTimeline.clear()
        spinningIconTimeline.fromTo(
          `.js-spinning-icon`,
          { rotate: 360 },
          {
            duration: acceleratedTickRate * 2,
            rotate: 0,
            ease: 'none',
          },
        )

        flashingLightTimeline.clear()
        flashingLightTimeline
          .to(`.js-flashing-light`, { opacity: 1, duration: 0.1 })
          .to(`.js-flashing-light`, { opacity: 0, duration: 0.1 })
          .to(`.js-flashing-light`, { opacity: 1, duration: 0.1 })
          .to(`.js-flashing-light`, { opacity: 0, duration: 0.1 })
          .to(`.js-flashing-light`, {
            opacity: 0,
            duration: acceleratedTickRate * 2 - 0.4,
          })
      }

      function endAnimation() {
        sounds.stopSound('bonk')
        sounds.playSound('glass-explosion')

        rotatingLightTimeline.kill()
        spinningIconTimeline.kill()
        flashingLightTimeline.kill()

        dispatch({ type: 'END_ROUND' })
      }

      return () => {
        sounds.stopSound('bonk')
        clearTimeout(accelerationTimeout)
        clearTimeout(endTimeout)
      }
    },
    {
      scope: lightsContainerRef,
      dependencies: [
        currentRoundAccelerationStartTime,
        currentRoundEndTime,
        currentRoundStartTime,
      ],
    },
  )

  return (
    <ScreenContainer
      className="touch-auto"
      screenName={AppScreen.Guessing}
      slotForMain={
        <div className="absolute inset-0">
          <PhraseFlipper />
          <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-3">
            <TeamDragSwitch />
          </div>
        </div>
      }
      slotForHeader={
        <AppHeader
          className="pointer-events-none"
          centerSlot={
            <button
              ref={lightsContainerRef}
              className={twMerge(classNames.button, 'pointer-events-auto')}
              onClick={() => dispatch({ type: 'ABORT_ROUND' })}
            >
              <span className={classNames.lightsContainer}>
                <span
                  className={twMerge(
                    `js-rotating-light`,
                    classNames.rotatingLight,
                    teamHoldingPhone === 'A'
                      ? 'opacity-100'
                      : 'opacity-0',
                    'transition-opacity duration-300',
                  )}
                  style={{
                    backgroundImage: `
                      conic-gradient(
                        from 0deg at 50% 50%,
                        transparent 15%,
                        ${teamAColor['500']} 25%,
                        transparent 35%,
                        transparent 65%,
                        ${teamAColor['500']} 75%,
                        transparent 85%
                      )
                    `,
                  }}
                />
                <span
                  className={twMerge(
                    `js-rotating-light`,
                    classNames.rotatingLight,
                    teamHoldingPhone === 'B'
                      ? 'opacity-100'
                      : 'opacity-0',
                    'transition-opacity duration-300',
                  )}
                  style={{
                    backgroundImage: `
                      conic-gradient(
                        from 0deg at 50% 50%,
                        transparent 15%,
                        ${teamBColor['500']} 25%,
                        transparent 35%,
                        transparent 65%,
                        ${teamBColor['500']} 75%,
                        transparent 85%
                      )
                    `,
                  }}
                />
                <span
                  ref={flashingLightElementRef}
                  className={twMerge(
                    `js-flashing-light`,
                    classNames.flashingLight,
                  )}
                />
                <span className={classNames.lightEdgeDarkener} />
              </span>

              <span
                className={twMerge(
                  `js-spinning-icon`,
                  classNames.spinningIcon,
                  teamHoldingPhone === 'A'
                    ? 'bg-teamAColor-500'
                    : 'bg-teamBColor-500',
                  'pointer-events-none transition-colors duration-300',
                )}
              >
                <Icon name="circle-quarters" />
              </span>
            </button>
          }
        />
      }
    />
  )
}
