'use client'

import { AppScreen } from '@/app/reducer'
import {
  teamAColor,
  teamAFillColor,
  teamBColor,
  teamBFillColor,
} from '@/app/theme'
import { useAppContext } from '@/components/AppContext'
import gsap from 'gsap'
import {
  ComponentProps,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'

const SNAP_BACK_DEAD_ZONE_PX = 8

function colorWithAlpha(color: string, alpha: number): string {
  const percentage = Math.round(alpha * 10_000) / 100
  return `color-mix(in srgb, ${color} ${percentage}%, transparent)`
}

function getClientX(e: React.TouchEvent | React.MouseEvent): number {
  return 'touches' in e ? e.touches[0].clientX : e.clientX
}

function getClientXFromPointer(e: TouchEvent | MouseEvent): number {
  return 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
}

interface TeamSelectorProps extends Omit<ComponentProps<'div'>, 'children'> {
  onSelectTeam: (team: 'A' | 'B') => void
  activeTeam: 'A' | 'B'
}

export const TeamSelector = forwardRef<HTMLDivElement, TeamSelectorProps>(
  function TeamSelector(
    { onSelectTeam, activeTeam, className, ...otherProps },
    ref,
  ) {
    const { state } = useAppContext()
    const railRef = useRef<HTMLDivElement>(null)
    const handleRef = useRef<HTMLDivElement>(null)
    const [maxPosition, setMaxPosition] = useState(0)
    const [positionPx, setPositionPx] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const positionObjRef = useRef({ value: 0 })
    const positionPxRef = useRef(0)
    const startXRef = useRef(0)
    const onSelectTeamRef = useRef(onSelectTeam)
    const dragListenersRef = useRef<{
      onMove: (e: TouchEvent | MouseEvent) => void
      onEnd: () => void
    } | null>(null)

    useEffect(() => {
      onSelectTeamRef.current = onSelectTeam
    }, [onSelectTeam])

    useEffect(() => {
      positionPxRef.current = positionPx
    }, [positionPx])

    useEffect(() => {
      return () => {
        const L = dragListenersRef.current
        if (!L) return
        const touchOpts: AddEventListenerOptions = { passive: true }
        window.removeEventListener('touchmove', L.onMove, touchOpts)
        window.removeEventListener('mousemove', L.onMove)
        window.removeEventListener('touchend', L.onEnd)
        window.removeEventListener('mouseup', L.onEnd)
        dragListenersRef.current = null
      }
    }, [])

    useEffect(() => {
      if (state.activeScreen === AppScreen.Guessing) return
      const L = dragListenersRef.current
      if (!L) return
      const touchOpts: AddEventListenerOptions = { passive: true }
      window.removeEventListener('touchmove', L.onMove, touchOpts)
      window.removeEventListener('mousemove', L.onMove)
      window.removeEventListener('touchend', L.onEnd)
      window.removeEventListener('mouseup', L.onEnd)
      dragListenersRef.current = null
      setIsDragging(false)
    }, [state.activeScreen])

    const displayPosition =
      isDragging || isAnimating
        ? positionPx
        : activeTeam === 'A'
          ? 0
          : maxPosition
    const midpoint = maxPosition / 2
    const t = maxPosition > 0 ? displayPosition / maxPosition : 0
    const leftAlpha = 1 - t
    const rightAlpha = t
    const trackGradient =
      maxPosition > 0
        ? `linear-gradient(to left, ${colorWithAlpha(teamAColor[500], leftAlpha)}, ${colorWithAlpha(teamBColor[500], rightAlpha)})`
        : `linear-gradient(to left, ${teamAColor[500]}, ${teamBColor[500]})`

    const updateMaxPosition = useCallback(() => {
      const rail = railRef.current
      const thumb = handleRef.current
      if (!rail || !thumb) return
      const max = Math.max(0, rail.offsetWidth - thumb.offsetWidth)
      setMaxPosition(max)
    }, [])

    useEffect(() => {
      updateMaxPosition()
      const ro = new ResizeObserver(updateMaxPosition)
      if (railRef.current) ro.observe(railRef.current)
      if (handleRef.current) ro.observe(handleRef.current)
      return () => ro.disconnect()
    }, [updateMaxPosition])

    const runToPositionRef = useRef<
      (
        targetPx: number,
        opts?: { startPx?: number; onComplete?: () => void },
      ) => void
    >(() => {})
    const runToPosition = useCallback(
      (
        targetPx: number,
        opts?: { startPx?: number; onComplete?: () => void },
      ) => {
        const startPx = opts?.startPx ?? displayPosition
        positionObjRef.current.value = startPx
        positionPxRef.current = startPx
        setPositionPx(startPx)
        setIsAnimating(true)
        gsap.to(positionObjRef.current, {
          value: targetPx,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: true,
          onUpdate: () => {
            const nextPosition = positionObjRef.current.value
            positionPxRef.current = nextPosition
            setPositionPx(nextPosition)
          },
          onComplete: () => {
            positionPxRef.current = targetPx
            setPositionPx(targetPx)
            setIsAnimating(false)
            opts?.onComplete?.()
          },
        })
      },
      [displayPosition],
    )

    useEffect(() => {
      runToPositionRef.current = runToPosition
    }, [runToPosition])

    function handleStart(e: React.TouchEvent | React.MouseEvent) {
      const el = railRef.current
      if (!el) return
      const startPosition = activeTeam === 'A' ? 0 : maxPosition
      startXRef.current = getClientX(e) - startPosition
      positionPxRef.current = startPosition
      setPositionPx(startPosition)
      setIsDragging(true)
      const onMove = (e: TouchEvent | MouseEvent) => {
        const track = railRef.current
        if (!track) return
        const x = getClientXFromPointer(e)
        const raw = x - startXRef.current
        const clamped = Math.max(0, Math.min(maxPosition, raw))
        positionPxRef.current = clamped
        setPositionPx(clamped)
      }
      const onEnd = () => {
        const L = dragListenersRef.current
        if (!L) return
        dragListenersRef.current = null
        const touchOpts: AddEventListenerOptions = { passive: true }
        window.removeEventListener('touchmove', L.onMove, touchOpts)
        window.removeEventListener('mousemove', L.onMove)
        window.removeEventListener('touchend', L.onEnd)
        window.removeEventListener('mouseup', L.onEnd)
        setIsDragging(false)
        const current = positionPxRef.current
        const pastMidpointLeft = current < midpoint - SNAP_BACK_DEAD_ZONE_PX
        const pastMidpointRight = current > midpoint + SNAP_BACK_DEAD_ZONE_PX
        const startPx = positionPxRef.current
        if (pastMidpointRight && activeTeam === 'A') {
          onSelectTeamRef.current('B')
          runToPosition(maxPosition, { startPx })
        } else if (pastMidpointLeft && activeTeam === 'B') {
          onSelectTeamRef.current('A')
          runToPosition(0, { startPx })
        } else {
          const snapTarget = activeTeam === 'A' ? 0 : maxPosition
          runToPosition(snapTarget, { startPx })
        }
      }
      dragListenersRef.current = { onMove, onEnd }
      const touchOpts: AddEventListenerOptions = { passive: true }
      window.addEventListener('touchmove', onMove, touchOpts)
      window.addEventListener('mousemove', onMove)
      window.addEventListener('touchend', onEnd)
      window.addEventListener('mouseup', onEnd)
    }

    function handleKeyboardSelect(team: 'A' | 'B') {
      if (team === activeTeam) return
      onSelectTeamRef.current(team)
      runToPositionRef.current(team === 'A' ? 0 : maxPosition, {
        startPx: positionPxRef.current,
      })
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handleKeyboardSelect('A')
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleKeyboardSelect('B')
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleKeyboardSelect(activeTeam === 'A' ? 'B' : 'A')
      }
    }

    const prevActiveTeamRef = useRef(activeTeam)
    useEffect(() => {
      if (isDragging || isAnimating || maxPosition <= 0) return
      if (prevActiveTeamRef.current === activeTeam) return
      prevActiveTeamRef.current = activeTeam
      const idle = activeTeam === 'A' ? 0 : maxPosition
      runToPositionRef.current(idle, { startPx: positionPxRef.current })
    }, [activeTeam, isAnimating, isDragging, maxPosition])

    const isHandleOnTeamA = t < 0.5
    const handleColor = isHandleOnTeamA ? teamAFillColor : teamBFillColor
    const handleTextColor = isHandleOnTeamA
      ? 'text-textOnTeamAColor'
      : 'text-textOnTeamBColor'
    const passToLetter = activeTeam === 'A' ? 'B' : 'A'

    return (
      <div
        ref={ref}
        className={twMerge('fixed inset-x-3 bottom-3 rounded-full', className)}
        {...otherProps}
      >
        <div
          className={twMerge(
            'overflow-hidden',
            'rounded-full',
            'shadow-lg',
            'touch-none',
            'select-none',
            'w-full',
            'min-w-0',
            'p-2',
          )}
          aria-label="Pass team selector"
          aria-valuemax={1}
          aria-valuemin={0}
          aria-valuenow={activeTeam === 'A' ? 0 : 1}
          aria-valuetext={`Pass to ${passToLetter}`}
          role="slider"
          style={{ background: trackGradient }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleStart}
          onMouseDown={handleStart}
        >
          <div
            ref={railRef}
            className="flex h-full w-full min-w-0 overflow-hidden"
            data-team-selector-rail
          >
            <div
              ref={handleRef}
              className={twMerge(
                'flex',
                'shrink-0',
                'items-center',
                'justify-center',
                'rounded-full',
                'border-neutralColor-100',
                'px-3',
                'shadow-lg',
              )}
              style={{
                transform: `translateX(${displayPosition}px)`,
                backgroundColor: handleColor,
              }}
              data-team-selector-handle
            >
              <span
                className={twMerge(
                  'inline-flex translate-y-px items-center text-sm whitespace-nowrap',
                  handleTextColor,
                )}
              >
                <span>PASS TO</span>
                <span className="ml-1 inline-flex w-[0.7em] shrink-0 items-center justify-center text-xl font-bold">
                  {passToLetter}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  },
)
