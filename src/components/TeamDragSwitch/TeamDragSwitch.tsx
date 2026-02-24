'use client'

import { useAppContext } from '@/components/AppContext'
import { twMerge } from 'tailwind-merge'

export function TeamDragSwitch() {
  const { dispatch, state } = useAppContext()
  const { teamHoldingPhone } = state

  return (
    <div
      className="flex gap-2"
      role="group"
      aria-label="Which team is holding the phone"
    >
      {(['A', 'B'] as const).map(team => {
        const isActive = teamHoldingPhone === team
        const isTeamA = team === 'A'
        return (
          <button
            key={team}
            type="button"
            onClick={() => dispatch({ type: 'SET_TEAM_HOLDING_PHONE', team })}
            className={twMerge(
              'flex aspect-square w-full max-w-[20vmin] flex-1 items-center justify-center rounded-xl border-2 text-lg font-bold shadow-md transition-all duration-300 ease-out',
              isTeamA
                ? 'border-teamAColor-500 bg-teamAColor-500 text-teamAColor-950'
                : 'border-teamBColor-500 bg-teamBColor-500 text-teamBColor-950',
              isActive &&
                'scale-[0.96] border-b-0 border-t-2 shadow-inner',
            )}
            aria-pressed={isActive}
            aria-label={`Team ${team}${isActive ? ' (holding phone)' : ''}`}
          >
            {team}
          </button>
        )
      })}
    </div>
  )
}
