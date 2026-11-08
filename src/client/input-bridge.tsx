import * as React from 'react'

import { setComposerBridge } from './bridge.js'
import type { ComposerInputActions } from './bridge.js'

export interface InputBridgeProps {
  sessionId?: string
  inputActions?: ComposerInputActions
}

/**
 * Zero-height `conversation.input.dock` entry. It publishes the active
 * composer's input actions so the root-scoped console can insert a capture.
 */
export function InputBridge(props: InputBridgeProps): null {
  const { sessionId, inputActions } = props
  React.useEffect(() => {
    if (typeof sessionId !== 'string' || sessionId === '' || inputActions === undefined) return
    return setComposerBridge({ sessionId, actions: inputActions })
  }, [sessionId, inputActions])
  return null
}
