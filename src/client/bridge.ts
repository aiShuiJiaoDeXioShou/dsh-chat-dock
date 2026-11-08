/**
 * A root-scoped console cannot receive the composer's `inputActions` directly.
 * A zero-height entry in `conversation.input.dock` publishes them here, and the
 * console inserts through this face.
 */

import { insertionText } from '../shared/format.js'

export interface ComposerInputActions {
  captureInsertion?: () => unknown
  insertText?: (text: string, span: unknown) => boolean
}

export interface ComposerBridgeEntry {
  sessionId: string
  actions: ComposerInputActions
}

let current: ComposerBridgeEntry | undefined

export function setComposerBridge(entry: ComposerBridgeEntry): () => void {
  current = entry
  return () => {
    if (current === entry) current = undefined
  }
}

export function getComposerBridge(): ComposerBridgeEntry | undefined {
  return current
}

export function hasComposerBridge(): boolean {
  return current !== undefined
}

function captureSpan(actions: ComposerInputActions): unknown {
  try {
    return actions.captureInsertion?.()
  } catch {
    return undefined
  }
}

/**
 * Insert at the caret, retrying once with a fresh span. Returns `unavailable`
 * when the composer is absent or refuses; the caller then falls back to copy.
 */
export function insertIntoComposer(text: string): 'inserted' | 'unavailable' {
  const entry = current
  if (entry === undefined || typeof entry.actions.insertText !== 'function') return 'unavailable'
  const payload = insertionText(text)
  if (payload === '') return 'unavailable'

  let span = captureSpan(entry.actions)
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      if (entry.actions.insertText(payload, span) === true) return 'inserted'
    } catch {
      /* retry once with a fresh span */
    }
    span = captureSpan(entry.actions)
  }
  return 'unavailable'
}
