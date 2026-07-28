'use client'

import { Icon } from '@/components/Icon'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { ReactNode, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import {
  DEV_THEME_PRESETS,
  DevThemePresetId,
  DevThemePreview,
  getDevThemePreset,
  getMatchingDevThemePreset,
  getScalableTailwindColor,
  isScalableTailwindColorName,
  scalableTailwindColorNames,
  serializeDevThemePreview,
} from './devTheme'

type ThemeField = keyof DevThemePreview
type CopyStatus = 'idle' | 'pending' | 'success' | 'error'
type ThemePresetValue = DevThemePresetId | ''

interface ThemeListboxItem<Value extends string> {
  disabled?: boolean
  label: string
  value: Value
}

const THEME_FIELDS = [
  { id: 'accent' as const, label: 'Accent' },
  { id: 'teamA' as const, label: 'Team A' },
  { id: 'teamB' as const, label: 'Team B' },
  { id: 'neutral' as const, label: 'Neutral' },
] as const

const THEME_PRESET_OPTIONS: readonly ThemeListboxItem<ThemePresetValue>[] = [
  { disabled: true, label: 'Custom', value: '' },
  ...DEV_THEME_PRESETS.map(theme => ({
    label: theme.label,
    value: theme.id,
  })),
]

function ColorSwatch({
  colorName,
  size,
}: {
  colorName: DevThemePreview[ThemeField]
  size: 'button' | 'option'
}) {
  return (
    <span
      aria-hidden="true"
      className={twJoin(
        'border-neutralColor-100/30 shrink-0 border',
        size === 'button' ? 'size-3' : 'size-[18px]',
      )}
      style={{ backgroundColor: getScalableTailwindColor(colorName) }}
    />
  )
}

function ThemeListbox<Value extends string>({
  id,
  label,
  value,
  items,
  onChange,
  renderLeading,
}: {
  id: string
  label: string
  value: Value
  items: readonly ThemeListboxItem<Value>[]
  onChange: (value: Value) => void
  renderLeading?: (value: Value, size: 'button' | 'option') => ReactNode
}) {
  const selectedItem = items.find(item => item.value === value)

  return (
    <Listbox
      value={value}
      onChange={onChange}
    >
      <div className="text-neutralColor-100 flex items-center justify-between gap-4 text-xs">
        <ListboxLabel>{label}</ListboxLabel>
        <ListboxButton
          id={id}
          className={twJoin(
            'border-neutralColor-100/30 text-neutralColor-100 grid h-7 w-28 items-center overflow-hidden rounded border bg-black p-0 text-xs',
            renderLeading
              ? 'grid-cols-[1.75rem_minmax(0,1fr)_1.75rem]'
              : 'grid-cols-[minmax(0,1fr)_1.75rem] pl-2',
            'focus-visible:outline-neutralColor-100/70 focus-visible:outline-2',
          )}
        >
          {({ open }) => (
            <>
              {renderLeading ? (
                <span className="inline-flex h-7 w-7 items-center justify-center">
                  {renderLeading(value, 'button')}
                </span>
              ) : null}
              <span className="min-w-0 truncate text-left">
                {selectedItem?.label ?? value}
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center">
                <Icon
                  name="chevron-down"
                  rotate={open ? 180 : undefined}
                  className="text-[0.6em]"
                />
              </span>
            </>
          )}
        </ListboxButton>
      </div>
      <ListboxOptions
        anchor={{ to: 'bottom end', gap: 4, padding: 8 }}
        portal
        modal={false}
        className={twJoin(
          'scrollbar-compact border-neutralColor-100/30 text-neutralColor-100 z-300 max-h-[min(420px,calc(100dvh-16px))] w-[168px] touch-pan-y overflow-y-auto overscroll-contain rounded border bg-black py-1 text-[18px] leading-none shadow-xl [-webkit-overflow-scrolling:touch]',
          'focus:outline-none',
        )}
      >
        {items.map(item => (
          <ListboxOption
            disabled={item.disabled}
            key={item.value || 'custom'}
            value={item.value}
            className={({ disabled, focus }) =>
              twJoin(
                'grid h-[36px] cursor-default items-center p-0 select-none',
                renderLeading
                  ? 'grid-cols-[36px_minmax(0,1fr)_36px]'
                  : 'grid-cols-[minmax(0,1fr)_36px]',
                focus && 'bg-neutralColor-100/15',
                disabled && 'opacity-50',
              )
            }
          >
            {({ selected }) => (
              <>
                {renderLeading ? (
                  <span className="inline-flex h-[36px] w-[36px] items-center justify-center">
                    {renderLeading(item.value, 'option')}
                  </span>
                ) : null}
                <span
                  className={twJoin(
                    'min-w-0 truncate text-left',
                    !renderLeading && 'pl-2',
                  )}
                >
                  {item.label}
                </span>
                <span className="inline-flex h-[36px] w-[36px] items-center justify-center">
                  {selected ? (
                    <Icon
                      name="check"
                      className="text-[0.75em]"
                    />
                  ) : null}
                </span>
              </>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}

function ThemeColorListbox({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: DevThemePreview[ThemeField]
  onChange: (value: DevThemePreview[ThemeField]) => void
}) {
  return (
    <ThemeListbox
      id={id}
      items={scalableTailwindColorNames.map(colorName => ({
        label: colorName,
        value: colorName,
      }))}
      label={label}
      value={value}
      onChange={onChange}
      renderLeading={(colorName, size) => (
        <ColorSwatch
          colorName={colorName}
          size={size}
        />
      )}
    />
  )
}

export function DevThemeControls({
  preview,
  onChange,
}: {
  preview: DevThemePreview
  onChange: (preview: DevThemePreview) => void
}) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle')

  function setThemeColor(
    field: ThemeField,
    colorName: DevThemePreview[ThemeField],
  ) {
    if (!isScalableTailwindColorName(colorName)) return

    setCopyStatus('idle')
    onChange({ ...preview, [field]: colorName })
  }

  function loadThemePreset(presetId: ThemePresetValue) {
    const preset = getDevThemePreset(presetId)
    if (!preset) return

    setCopyStatus('idle')
    onChange({ ...preset.palette })
  }

  async function copyTheme() {
    if (copyStatus === 'pending') return

    setCopyStatus('pending')

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable')
      }

      await navigator.clipboard.writeText(serializeDevThemePreview(preview))
      setCopyStatus('success')
    } catch {
      setCopyStatus('error')
    }
  }

  const copyStatusMessage =
    copyStatus === 'success'
      ? 'Theme copied.'
      : copyStatus === 'error'
        ? 'Could not copy theme.'
        : ''
  const selectedThemePresetId = getMatchingDevThemePreset(preview)?.id ?? ''

  return (
    <div className="flex flex-col gap-2">
      <span className="text-neutralColor-100/70 text-xs tracking-wide uppercase">
        Theme
      </span>
      <ThemeListbox
        id="dev-theme-preset"
        items={THEME_PRESET_OPTIONS}
        label="Preset"
        value={selectedThemePresetId}
        onChange={loadThemePreset}
      />
      {THEME_FIELDS.map(field => (
        <ThemeColorListbox
          key={field.id}
          id={`dev-theme-${field.id}`}
          label={field.label}
          value={preview[field.id]}
          onChange={colorName => setThemeColor(field.id, colorName)}
        />
      ))}
      <button
        type="button"
        onClick={copyTheme}
        disabled={copyStatus === 'pending'}
        aria-busy={copyStatus === 'pending' ? 'true' : undefined}
        className={twJoin(
          'border-neutralColor-100/30 bg-neutralColor-100/10 text-neutralColor-100 flex h-8 w-full items-center justify-center gap-2 rounded border px-3 text-xs',
          copyStatus === 'pending'
            ? 'cursor-wait'
            : 'hover:bg-neutralColor-100/20',
        )}
      >
        <span className="inline-flex w-4 justify-center">
          <Icon
            name={
              copyStatus === 'pending'
                ? 'spinner-third'
                : copyStatus === 'success'
                  ? 'check'
                  : copyStatus === 'error'
                    ? 'triangle-exclamation'
                    : 'copy'
            }
            spin={copyStatus === 'pending'}
          />
        </span>
        <span>Copy Theme</span>
      </button>
      <span
        className="sr-only"
        aria-live="polite"
      >
        {copyStatusMessage}
      </span>
    </div>
  )
}
