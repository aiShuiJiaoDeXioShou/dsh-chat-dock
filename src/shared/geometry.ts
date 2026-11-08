/** Pure geometry for the draggable floating console. */

import type { ConsoleRect, ConsoleUiState } from './types.js'

export const CONSOLE_MIN_WIDTH = 300
export const CONSOLE_MIN_HEIGHT = 360
export const CONSOLE_DEFAULT_WIDTH = 360
export const CONSOLE_DEFAULT_HEIGHT = 520
export const CONSOLE_MARGIN = 16
export const CONSOLE_PILL_SIZE = 44

export interface Viewport {
  width: number
  height: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function usableViewport(viewport: Viewport): Viewport {
  return {
    width: Number.isFinite(viewport.width) && viewport.width > 0 ? viewport.width : 1024,
    height: Number.isFinite(viewport.height) && viewport.height > 0 ? viewport.height : 768,
  }
}

/** Bottom-right default, clamped into the viewport. */
export function defaultBounds(viewport: Viewport): ConsoleRect {
  const view = usableViewport(viewport)
  const width = Math.min(
    CONSOLE_DEFAULT_WIDTH,
    Math.max(CONSOLE_MIN_WIDTH, view.width - CONSOLE_MARGIN * 2),
  )
  const height = Math.min(
    CONSOLE_DEFAULT_HEIGHT,
    Math.max(CONSOLE_MIN_HEIGHT, view.height - CONSOLE_MARGIN * 2),
  )
  return clampRect(
    {
      x: view.width - width - CONSOLE_MARGIN,
      y: view.height - height - CONSOLE_MARGIN,
      width,
      height,
    },
    view,
  )
}

/** Keep the console fully reachable, shrinking it only when the viewport demands it. */
export function clampRect(rect: ConsoleRect, viewport: Viewport): ConsoleRect {
  const view = usableViewport(viewport)
  const maxWidth = Math.max(240, view.width - CONSOLE_MARGIN * 2)
  const maxHeight = Math.max(240, view.height - CONSOLE_MARGIN * 2)
  const width = Math.min(Math.max(rect.width, CONSOLE_MIN_WIDTH), maxWidth)
  const height = Math.min(Math.max(rect.height, CONSOLE_MIN_HEIGHT), maxHeight)
  return {
    x: clamp(rect.x, CONSOLE_MARGIN, view.width - width - CONSOLE_MARGIN),
    y: clamp(rect.y, CONSOLE_MARGIN, view.height - height - CONSOLE_MARGIN),
    width,
    height,
  }
}

export function isConsoleRect(value: unknown): value is ConsoleRect {
  if (value === null || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.x === 'number' &&
    Number.isFinite(record.x) &&
    typeof record.y === 'number' &&
    Number.isFinite(record.y) &&
    typeof record.width === 'number' &&
    Number.isFinite(record.width) &&
    record.width > 0 &&
    typeof record.height === 'number' &&
    Number.isFinite(record.height) &&
    record.height > 0
  )
}

export function clampConsoleState(state: ConsoleUiState, viewport: Viewport): ConsoleUiState {
  return {
    bounds: clampRect(state.bounds, viewport),
    collapsed: state.collapsed,
    hidden: state.hidden,
  }
}

/** Top-left of a collapsed pill inside the same anchor as the expanded panel. */
export function pillRect(bounds: ConsoleRect, viewport: Viewport): ConsoleRect {
  const view = usableViewport(viewport)
  return {
    x: clamp(bounds.x, CONSOLE_MARGIN, view.width - CONSOLE_PILL_SIZE - CONSOLE_MARGIN),
    y: clamp(bounds.y, CONSOLE_MARGIN, view.height - CONSOLE_PILL_SIZE - CONSOLE_MARGIN),
    width: CONSOLE_PILL_SIZE,
    height: CONSOLE_PILL_SIZE,
  }
}
