'use client'

import { HEARTS_PER_TEAM } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { Button } from '@/components/Button'
import { screencapMode } from '@/screencap.config.mjs'
import clamp from 'lodash/clamp'
import { useLayoutEffect, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import {
  applyDevThemePreview,
  persistDevThemePreview,
  readDevThemePreview,
} from './devTheme'
import { DevThemeControls } from './DevThemeControls'

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
  const [themePreview, setThemePreview] = useState(readDevThemePreview)
  const {
    heartsRemainingForTeamA,
    heartsRemainingForTeamB,
    roundDurationMin,
    roundDurationMax,
  } = state

  useLayoutEffect(() => {
    applyDevThemePreview(themePreview)
    persistDevThemePreview(themePreview)
  }, [themePreview])

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
    <div hidden={screencapMode}>
      <Button
        data-dev-panel
        type="button"
        onClick={() => setOpen(o => !o)}
        icon="gear"
        variant="neutral"
        size="compact"
        className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-200 shadow"
        aria-expanded={open}
        aria-label={open ? 'Close dev panel' : 'Open dev panel'}
      />
      {open && (
        <dialog
          data-dev-panel
          open
          className={twJoin(
            'fixed',
            'top-auto',
            'bottom-10',
            'left-auto',
            'right-2',
            'z-200',
            'origin-bottom-right',
            'scale-75',
            'm-0',
            'flex',
            'flex-col',
            'gap-3',
            'max-h-[calc(100dvh-4rem)]',
            'overflow-y-auto',
            'rounded-lg',
            'border',
            'border-neutralColor-100/20',
            'bg-black/90',
            'p-4',
            'shadow-xl',
            'backdrop-blur',
            'whitespace-nowrap',
          )}
          aria-label="Dev panel"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-neutralColor-100/70 text-xs tracking-wide uppercase">
              Team A
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                onClick={() => setHearts('A', -1)}
                disabled={heartsRemainingForTeamA <= 0}
                variant="secondary"
                size="compact"
                aria-label="Decrease Team A score"
                icon="minus"
              />
              <span className="text-neutralColor-100 min-w-6 text-center">
                {heartsRemainingForTeamA}
              </span>
              <Button
                type="button"
                onClick={() => setHearts('A', 1)}
                disabled={heartsRemainingForTeamA >= HEARTS_PER_TEAM}
                variant="secondary"
                size="compact"
                aria-label="Increase Team A score"
                icon="plus"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-neutralColor-100/70 text-xs tracking-wide uppercase">
              Team B
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                onClick={() => setHearts('B', -1)}
                disabled={heartsRemainingForTeamB <= 0}
                variant="secondary"
                size="compact"
                aria-label="Decrease Team B score"
                icon="minus"
              />
              <span className="text-neutralColor-100 min-w-6 text-center">
                {heartsRemainingForTeamB}
              </span>
              <Button
                type="button"
                onClick={() => setHearts('B', 1)}
                disabled={heartsRemainingForTeamB >= HEARTS_PER_TEAM}
                variant="secondary"
                size="compact"
                aria-label="Increase Team B score"
                icon="plus"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-neutralColor-100/70 text-xs tracking-wide uppercase">
              Round
            </span>
            <div className="flex gap-1">
              {ROUND_PRESETS.map(preset => {
                const active =
                  getRoundPresetId(roundDurationMin, roundDurationMax) ===
                  preset.id
                return (
                  <Button
                    key={preset.id}
                    type="button"
                    onClick={() => setRoundDuration(preset.min, preset.max)}
                    variant={active ? 'primary' : 'secondary'}
                    size="compact"
                    aria-pressed={active}
                    className="min-w-0 flex-1"
                  >
                    {preset.label}
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="bg-neutralColor-100/20 h-px" />
          <DevThemeControls
            preview={themePreview}
            onChange={setThemePreview}
          />
          <div className="bg-neutralColor-100/20 h-px" />
          <Button
            type="button"
            onClick={() => {
              document.documentElement.dataset.devUiHidden = 'true'
            }}
            variant="secondary"
            size="compact"
            fullWidth
            icon="eye-slash"
          >
            Hide Until Reload
          </Button>
        </dialog>
      )}
    </div>
  )
}
