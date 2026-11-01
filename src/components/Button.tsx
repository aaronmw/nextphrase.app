'use client'

import { Icon } from '@/components/Icon'
import type { IconProps, IconString } from '@/components/Icon/types'
import { usePressFeedback } from '@/components/usePressFeedback'
import { Children, type ComponentProps, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'neutral'

type ButtonAppearanceProps = {
  children?: ReactNode
  icon?: IconString
  iconProps?: Omit<IconProps, 'name'>
  variant?: ButtonVariant
  // Compact for dense controls; large for the end-of-game action.
  size?: 'default' | 'compact' | 'large'
  fullWidth?: boolean
  // Team tones identify the winning team's New Game action.
  tone?: 'accent' | 'teamA' | 'teamB'
}

export type ButtonProps = ComponentProps<'button'> & ButtonAppearanceProps

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-accentFillColor bg-accentFillColor text-textOnAccentColor',
  secondary:
    'border-primaryColor-400/40 bg-transparent text-primaryColor-400 backdrop-blur-sm',
  tertiary: 'border-transparent bg-transparent text-primaryColor-400',
  neutral:
    'border-transparent bg-bgColor text-neutralColor-100 hover:bg-neutralColor-100/10',
}

const primaryToneClasses = {
  accent: '',
  teamA: 'border-teamAFillColor bg-teamAFillColor text-textOnTeamAColor',
  teamB: 'border-teamBFillColor bg-teamBFillColor text-textOnTeamBColor',
}

function buttonClassName({
  children,
  icon,
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  tone = 'accent',
  className,
}: ButtonAppearanceProps & { className?: string }) {
  const hasLabel = Children.toArray(children).some(child =>
    typeof child === 'string' ? child.trim().length > 0 : true,
  )
  const iconOnly = Boolean(icon) && !hasLabel

  return twMerge(
    `before:from-bgColor/20 focus-visible:outline-primaryColor-400 relative inline-flex shrink-0 cursor-pointer items-center
      justify-center gap-1.5 border-4 text-center text-xs leading-none tracking-tighter
      whitespace-nowrap uppercase transition-[background-color,border-color,color,box-shadow,transform]
      duration-150 select-none
      [-webkit-user-select:none] [text-shadow:2px_2px_2px_rgba(0,0,0,0.25)] before:pointer-events-none before:absolute
      before:inset-0 before:rounded-[inherit] before:bg-gradient-to-t before:to-transparent
      before:opacity-0 before:transition-opacity
      hover:before:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2
      disabled:pointer-events-none disabled:opacity-40
      motion-reduce:transition-none motion-reduce:before:transition-none
      [&:is(:active,[data-pressed])]:scale-95
      [&:is(:active,[data-pressed])]:duration-0
      [&:is(:active,[data-pressed])]:before:opacity-100 [&:is(:active,[data-pressed])]:before:duration-0`,
    variantClasses[variant],
    variant === 'primary' && primaryToneClasses[tone],
    iconOnly
      ? [
          'rounded-full p-0',
          size === 'compact'
            ? 'size-5'
            : size === 'large'
              ? 'size-14 text-2xl'
              : 'size-6',
        ]
      : [
          'rounded-sm px-3 pt-[0.3125rem] pb-[0.1875rem]',
          size === 'compact' && 'px-2 py-1',
          size === 'large' && 'h-14 rounded-xl text-2xl',
          fullWidth && 'w-full',
        ],
    className,
  )
}

function ButtonContent({ icon, iconProps, children }: ButtonAppearanceProps) {
  return (
    <>
      {icon && (
        <Icon
          {...iconProps}
          aria-hidden="true"
          name={icon}
        />
      )}
      {children}
    </>
  )
}

/** An icon without a text child makes a circle. Supply its accessible name with aria-label. */
export function Button({
  children,
  icon,
  iconProps,
  variant = 'primary',
  size = 'default',
  fullWidth,
  tone,
  className,
  disabled,
  onPointerDown,
  type = 'button',
  ...props
}: ButtonProps) {
  const handlePress = usePressFeedback({ sound: true, disabled })
  const appearance = {
    children,
    icon,
    iconProps,
    variant,
    size,
    fullWidth,
    tone,
  }

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      data-button-variant={variant}
      className={buttonClassName({ ...appearance, className })}
      onPointerDown={event => {
        onPointerDown?.(event)
        if (!event.defaultPrevented) handlePress(event)
      }}
    >
      <ButtonContent {...appearance} />
    </button>
  )
}

/** Non-interactive visual copy above portalled confetti; shares the real button's appearance. */
export function ButtonVisual({
  className,
  ...appearance
}: ButtonAppearanceProps & { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={twMerge(
        buttonClassName({ ...appearance, className }),
        'pointer-events-none',
      )}
    >
      <ButtonContent {...appearance} />
    </span>
  )
}
