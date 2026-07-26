'use client'

import { HEARTS_PER_TEAM } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { Icon } from '@/components/Icon'
import { clamp } from 'lodash'
import { useState } from 'react'
import { twMerge, twJoin } from 'tailwind-merge'

const ROUND_PRESETS = [
  { id: 'short' as const, label: 'Short', min: 3, max: 5 },
  { id: 'med' as const, label: 'Med', min: 10, max: 15 },
  { id: 'def' as const, label: 'Def.', min: 45, max: 60 },
] as const

function getRoundPresetId(
  min: number,
  max: number,
): (typeof ROUND_PRESETS)[number]['id'] {
  const match = ROUND_PRESETS.find(p => p.min === min && p.max === max)
  return match?.id ?? 'def'
}

export function DevPanel() {
  const { dispatch, state } = useAppContext()
  const [open, setOpen] = useState(false)
  const {
    heartsRemainingForTeamA,
    heartsRemainingForTeamB,
    roundDurationMin,
    roundDurationMax,
  } = state

  function setHearts(team: 'A' | 'B', delta: number) {
    const current =
      team === 'A' ? heartsRemainingForTeamA : heartsRemainingForTeamB
    const next = clamp(current + delta, 0, HEARTS_PER_TEAM)
    dispatch({
      type: 'SET_HEARTS',
      heartsA: team === 'A' ? next : heartsRemainingForTeamA,
      heartsB: team === 'B' ? next : heartsRemainingForTeamB,
    })
  }

  function setRoundDuration(min: number, max: number) {
    dispatch({
      type: 'SET_ROUND_DURATION',
      roundDurationMin: min,
      roundDurationMax: max,
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={twMerge(
          'fixed',
          'right-4',
          'bottom-4',
          'z-200',
          'flex',
          'h-5',
          'w-5',
          'items-center',
          'justify-center',
          'rounded-full',
          'bg-black/20',
          'text-xs',
          'text-white',
          'shadow',
          'hover:bg-black/30',
        )}
        aria-label="Open dev panel"
      >
        <Icon name="gear" />
      </button>
      {open && (
        <div
          className={twJoin(
            'fixed',
            'bottom-10',
            'right-4',
            'z-200',
            'origin-bottom-right',
            'scale-75',
            'flex',
            'flex-col',
            'gap-3',
            'rounded-lg',
            'border',
            'border-white/20',
            'bg-black/90',
            'p-4',
            'shadow-xl',
            'backdrop-blur',
            'whitespace-nowrap',
          )}
          role="dialog"
          aria-label="Dev panel"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs tracking-wide text-white/70 uppercase">
              Team A
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setHearts('A', -1)}
                disabled={heartsRemainingForTeamA <= 0}
                className="h-7 w-7 rounded border border-white/30 bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10"
                aria-label="Decrease Team A score"
              >
                −
              </button>
              <span className="min-w-6 text-center text-white">
                {heartsRemainingForTeamA}
              </span>
              <button
                type="button"
                onClick={() => setHearts('A', 1)}
                disabled={heartsRemainingForTeamA >= HEARTS_PER_TEAM}
                className="h-7 w-7 rounded border border-white/30 bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10"
                aria-label="Increase Team A score"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs tracking-wide text-white/70 uppercase">
              Team B
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setHearts('B', -1)}
                disabled={heartsRemainingForTeamB <= 0}
                className="h-7 w-7 rounded border border-white/30 bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10"
                aria-label="Decrease Team B score"
              >
                −
              </button>
              <span className="min-w-6 text-center text-white">
                {heartsRemainingForTeamB}
              </span>
              <button
                type="button"
                onClick={() => setHearts('B', 1)}
                disabled={heartsRemainingForTeamB >= HEARTS_PER_TEAM}
                className="h-7 w-7 rounded border border-white/30 bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10"
                aria-label="Increase Team B score"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-wide text-white/70 uppercase">
              Round
            </span>
            <div className="flex gap-1">
              {ROUND_PRESETS.map(preset => {
                const active =
                  getRoundPresetId(roundDurationMin, roundDurationMax) ===
                  preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setRoundDuration(preset.min, preset.max)}
                    className={twJoin(
                      'flex-1 rounded border px-2 py-1.5 text-xs',
                      active
                        ? 'border-white/50 bg-white/20 text-white'
                        : 'border-white/30 bg-white/10 text-white/70 hover:bg-white/15',
                    )}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
