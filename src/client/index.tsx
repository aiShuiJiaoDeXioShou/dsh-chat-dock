/**
 * Browser half entry for dsh-chat-dock.
 *
 * Wiring only: register locale/CSS and the four public slots the plugin uses.
 *  - `shell.overlay`                          -> floating console
 *  - `conversation.session.header.actions`    -> open Chat
 *  - `sidebar.footer.action`                  -> show/hide the console
 *  - `conversation.input.dock`                -> publish composer input actions
 */

import * as React from 'react'

import type { StorageLike } from '../shared/settings.js'
import { Console } from './console.js'
import { ConsoleToggle } from './console-toggle.js'
import { InputBridge } from './input-bridge.js'
import type { InputBridgeProps } from './input-bridge.js'
import { en, fill, zh, type Translate } from './locale.js'
import { OpenButton } from './open-button.js'
import { CSS_TEXT } from './styles.js'

const NS = 'dshChatDock'

interface PluginLocale {
  register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void
  bind(namespace: string): (key: string) => string
}

interface PluginSlots {
  inject(name: string, factory: () => (() => void) | void): void
  register(options: Record<string, unknown>, component: (props: never) => React.ReactElement | null): () => void
}

export interface PluginContext {
  effect(register: () => (() => void) | void, label?: string): void
  locale: PluginLocale
  slots: PluginSlots
  get(name: string): unknown
}

export const inject = ['slots', 'locale']

type AnyComponent = React.ComponentType<any>

function safeStorage(): StorageLike | undefined {
  try {
    const storage = window.localStorage
    return storage === undefined || storage === null ? undefined : storage
  } catch {
    return undefined
  }
}

export function apply(ctx: PluginContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-chat-dock: locale')
  const bound = ctx.locale.bind(NS)
  const t: Translate = (key, params) => fill(bound(key), params)
  const storage = safeStorage()
  const services = {
    get: (name: string): unknown => ctx.get(name),
  }

  ctx.effect(() => {
    const style = document.createElement('style')
    style.setAttribute('data-plugin-css', 'dsh-chat-dock')
    style.textContent = CSS_TEXT
    document.head.appendChild(style)
    return () => {
      style.remove()
    }
  }, 'dsh-chat-dock: styles')

  const ConsoleView = Console as AnyComponent
  ctx.effect(
    () =>
      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          { name: 'shell.overlay', id: 'chat-dock-console', order: 60, locale: NS },
          (props: Record<string, unknown>) =>
            React.createElement(ConsoleView, { ...props, t, services, storage }),
        ),
      ),
    'dsh-chat-dock: console',
  )

  const OpenView = OpenButton as AnyComponent
  ctx.effect(
    () =>
      ctx.slots.inject('conversation.session.header.actions', () =>
        ctx.slots.register(
          { name: 'conversation.session.header.actions', id: 'chat-dock-open', order: 45, locale: NS },
          (props: Record<string, unknown>) => React.createElement(OpenView, { ...props, t, services, storage }),
        ),
      ),
    'dsh-chat-dock: header action',
  )

  const ToggleView = ConsoleToggle as AnyComponent
  ctx.effect(
    () =>
      ctx.slots.inject('sidebar.footer.action', () =>
        ctx.slots.register(
          {
            name: 'sidebar.footer.action',
            id: 'chat-dock-toggle',
            order: 30,
            label: () => t('action.toggle'),
            locale: NS,
          },
          () => React.createElement(ToggleView, { t }),
        ),
      ),
    'dsh-chat-dock: console toggle',
  )

  const BridgeView = InputBridge as AnyComponent
  ctx.effect(
    () =>
      ctx.slots.inject('conversation.input.dock', () =>
        ctx.slots.register(
          { name: 'conversation.input.dock', id: 'chat-dock-bridge', order: 4 },
          (props: Record<string, unknown>) => React.createElement(BridgeView, props as InputBridgeProps),
        ),
      ),
    'dsh-chat-dock: composer bridge',
  )
}
