'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Icon } from '@/components/Icon'
import { PhraseFlipper } from '@/components/PhraseFlipper'
import { ScreenContainer } from '@/components/ScreenContainer'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import colors from 'tailwindcss/colors'
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
      slotForMain={<PhraseFlipper />}
      slotForHeader={
        <AppHeader
          centerSlot={
            <button
              ref={lightsContainerRef}
              className={classNames.button}
              onClick={() => dispatch({ type: 'ABORT_ROUND' })}
            >
              <span className={classNames.lightsContainer}>
                <span
                  className={twMerge(
                    `js-rotating-light`,
                    classNames.rotatingLight,
                  )}
                  style={{
                    backgroundImage: `
                      conic-gradient(
                        from 0deg at 50% 50%,
                        transparent 15%,
                        ${colors.red['500']} 25%,
                        transparent 35%,
                        transparent 65%,
                        ${colors.red['500']} 75%,
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
                className={twMerge(`js-spinning-icon`, classNames.spinningIcon)}
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
