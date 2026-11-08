import * as React from 'react'

import { loadSettings } from '../shared/settings.js'
import type { StorageLike } from '../shared/settings.js'
import { pickSite, resolveSites } from '../shared/sites.js'
import { consoleEvents } from './events.js'
import { getSidebarRight, openSite } from './floating.js'
import type { ServiceGetter } from './floating.js'
import { ChatGlyph } from './icons.js'
import type { Translate } from './locale.js'

export interface OpenButtonProps {
  t: Translate
  services: ServiceGetter
  storage: StorageLike | undefined
}

/** `conversation.session.header.actions` entry: open the default Chat site. */
export function OpenButton(props: OpenButtonProps): React.ReactElement {
  const { t, services, storage } = props
  const onClick = (): void => {
    const settings = loadSettings(storage)
    const site = pickSite(resolveSites(settings), settings.defaultSite)
    if (site === undefined) {
      consoleEvents.show({ kind: 'warn', text: t('status.noSite') })
      return
    }
    const outcome = openSite(getSidebarRight(services), site, settings.openMode)
    if (!outcome.ok) {
      consoleEvents.show({
        kind: 'error',
        text: outcome.reason === 'unavailable' ? t('status.noSidebar') : t('status.openFailed'),
      })
    }
  }
  return (
    <button
      type="button"
      className="dsh-chat-dock-icon-btn"
      onClick={onClick}
      title={t('action.open')}
      aria-label={t('action.open')}
    >
      <ChatGlyph size={15} />
    </button>
  )
}
