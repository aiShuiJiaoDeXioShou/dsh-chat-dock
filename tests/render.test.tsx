import assert from 'node:assert/strict'
import test, { after } from 'node:test'

import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Console } from '../src/client/console.js'
import { ConsoleToggle } from '../src/client/console-toggle.js'
import { InputBridge } from '../src/client/input-bridge.js'
import { fill, zh } from '../src/client/locale.js'
import { OpenButton } from '../src/client/open-button.js'
import { SettingsView } from '../src/client/settings-view.js'
import { defaultSettings, CONSOLE_KEY, type StorageLike } from '../src/shared/settings.js'
import { resolveSites } from '../src/shared/sites.js'

const globals = globalThis as unknown as Record<string, unknown>
const previousWindow = globals.window
const previousDocument = globals.document

globals.window = {
  innerWidth: 1440,
  innerHeight: 900,
  addEventListener: () => {},
  removeEventListener: () => {},
  setTimeout: (callback: () => void) => setTimeout(callback, 0),
  clearTimeout: (handle: number) => clearTimeout(handle),
  setInterval: (callback: () => void) => setInterval(callback, 60_000),
  clearInterval: (handle: number) => clearInterval(handle),
}
globals.document = { documentElement: { lang: 'zh-CN' } }

after(() => {
  globals.window = previousWindow
  globals.document = previousDocument
})

class MemoryStorage implements StorageLike {
  readonly map = new Map<string, string>()

  getItem(key: string): string | null {
    return this.map.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value)
  }

  removeItem(key: string): void {
    this.map.delete(key)
  }
}

const t = (key: string, params?: Record<string, string | number>): string => fill(zh[key] ?? key, params)

test('Console renders the floating panel with the default site', () => {
  const markup = renderToStaticMarkup(
    React.createElement(Console, { t, services: { get: () => undefined }, storage: undefined }),
  )
  assert.ok(markup.includes('dsh-chat-dock-panel'))
  assert.ok(markup.includes('Chat 浮窗'))
  assert.ok(markup.includes('DeepSeek Chat'))
  assert.ok(markup.includes('dsh-chat-dock-mirror'))
})

test('Console renders the collapsed pill and nothing when hidden', () => {
  const collapsed = new MemoryStorage()
  collapsed.setItem(
    CONSOLE_KEY,
    JSON.stringify({ bounds: { x: 100, y: 100, width: 360, height: 520 }, collapsed: true, hidden: false }),
  )
  const pill = renderToStaticMarkup(
    React.createElement(Console, { t, services: { get: () => undefined }, storage: collapsed }),
  )
  assert.ok(pill.includes('dsh-chat-dock-pill'))
  assert.ok(!pill.includes('dsh-chat-dock-panel'))

  const hidden = new MemoryStorage()
  hidden.setItem(
    CONSOLE_KEY,
    JSON.stringify({ bounds: { x: 100, y: 100, width: 360, height: 520 }, collapsed: false, hidden: true }),
  )
  const empty = renderToStaticMarkup(
    React.createElement(Console, { t, services: { get: () => undefined }, storage: hidden }),
  )
  assert.equal(empty, '')
})

test('SettingsView renders site toggles and the custom-site editor', () => {
  const settings = defaultSettings()
  const markup = renderToStaticMarkup(
    React.createElement(SettingsView, {
      t,
      settings,
      enabledSites: resolveSites(settings),
      onChange: () => {},
      onReset: () => {},
      onClose: () => {},
    }),
  )
  assert.ok(markup.includes('dsh-chat-dock-settings'))
  assert.ok(markup.includes('启用站点'))
  assert.ok(markup.includes('自定义站点（JSON）'))
  assert.ok(markup.includes('DeepSeek Chat'))
})

test('entry buttons render accessible labels and the bridge renders nothing', () => {
  const open = renderToStaticMarkup(
    React.createElement(OpenButton, { t, services: { get: () => undefined }, storage: undefined }),
  )
  assert.ok(open.includes('aria-label="在右侧栏打开 Chat"'))

  const toggle = renderToStaticMarkup(React.createElement(ConsoleToggle, { t }))
  assert.ok(toggle.includes('aria-label="Chat 浮窗"'))

  const bridge = renderToStaticMarkup(React.createElement(InputBridge, {}))
  assert.equal(bridge, '')
})
