'use client'

import { useAppContext } from '@/components/AppContext'
import { type PointerEvent, useEffect, useRef } from 'react'

/** Shared pointer feedback for ordinary buttons and the custom game controls. */
export function usePressFeedback({
  sound,
  disabled = false,
}: {
  sound: boolean
  disabled?: boolean
}) {
  const { sounds } = useAppContext()
  const pressCleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => () => pressCleanupRef.current?.(), [])
  useEffect(() => {
    if (disabled) pressCleanupRef.current?.()
  }, [disabled])

  return function handlePointerDown(event: PointerEvent<HTMLElement>) {
    const isPrimaryPress =
      event.isPrimary && (event.pointerType !== 'mouse' || event.button === 0)

    if (disabled || !isPrimaryPress || pressCleanupRef.current) return

    const { pointerId } = event
    const pressedElement = event.currentTarget
    // Keep immediate press feedback on touch browsers that delay :active.
    pressedElement.setAttribute('data-pressed', '')
    if (sound) sounds.playSound('spacebar-down')

    const finishPress = (releaseEvent: globalThis.PointerEvent) => {
      if (releaseEvent.pointerId !== pointerId) return
      pressCleanupRef.current?.()
      if (sound) sounds.playSound('spacebar-up')
    }

    const cancelPress = (cancelEvent: globalThis.PointerEvent) => {
      if (cancelEvent.pointerId === pointerId) pressCleanupRef.current?.()
    }

    const cleanup = () => {
      window.removeEventListener('pointerup', finishPress, true)
      window.removeEventListener('pointercancel', cancelPress)
      window.removeEventListener('blur', cleanup)
      pressedElement.removeAttribute('data-pressed')
      pressCleanupRef.current = null
    }

    pressCleanupRef.current = cleanup
    window.addEventListener('pointerup', finishPress, true)
    window.addEventListener('pointercancel', cancelPress)
    window.addEventListener('blur', cleanup)
  }
}
