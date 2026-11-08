import * as React from 'react'

import { consoleEvents } from './events.js'
import { ChatGlyph } from './icons.js'
import type { Translate } from './locale.js'

export interface ConsoleToggleProps {
  t: Translate
}

/** `sidebar.footer.action` entry: show or hide the floating console. */
export function ConsoleToggle({ t }: ConsoleToggleProps): React.ReactElement {
  return (
    <button
      type="button"
      className="dsh-chat-dock-icon-btn"
      onClick={() => consoleEvents.toggle()}
      title={t('action.toggle')}
      aria-label={t('action.toggle')}
    >
      <ChatGlyph size={15} />
    </button>
  )
}
