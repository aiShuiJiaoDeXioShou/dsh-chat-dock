import assert from 'node:assert/strict'
import test from 'node:test'

import {
  defaultSettings,
  loadConsoleState,
  loadSettings,
  parseCustomSites,
  saveConsoleState,
  saveSettings,
  sanitizeSettings,
  clearPluginStorage,
  CONSOLE_KEY,
  SETTINGS_KEY,
  type StorageLike,
} from '../src/shared/settings.js'

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

test('defaultSettings enables DeepSeek only and mirrors replies', () => {
  const settings = defaultSettings()
  assert.equal(settings.version, 1)
  assert.equal(settings.defaultSite, 'deepseek')
  assert.equal(settings.openMode, 'docked')
  assert.equal(settings.mirror, true)
  assert.equal(settings.intervalMs, 2500)
  assert.deepEqual(settings.customSites, [])
})

test('sanitizeSettings repairs invalid values and clamps the interval', () => {
  const sanitized = sanitizeSettings({
    defaultSite: 7,
    openMode: 'bogus',
    mirror: 'yes',
    intervalMs: 5,
    overrides: {
      deepseek: { enabled: false, url: 'ftp://example.com' },
      chatgpt: 'nope',
    },
    customSites: [{ id: '', label: 'bad', url: 'nope' }],
  })
  assert.equal(sanitized.defaultSite, 'deepseek')
  assert.equal(sanitized.openMode, 'docked')
  assert.equal(sanitized.mirror, true)
  assert.equal(sanitized.intervalMs, 1500)
  assert.equal(sanitized.overrides.deepseek?.enabled, false)
  assert.equal(sanitized.overrides.deepseek?.url, undefined)
  assert.equal(sanitized.overrides.chatgpt, undefined)
  assert.equal(sanitized.customSites.length, 0)
})

test('settings survive a storage round trip', () => {
  const storage = new MemoryStorage()
  const settings = { ...defaultSettings(), intervalMs: 5000, mirror: false }
  saveSettings(storage, settings)
  assert.equal(storage.getItem(SETTINGS_KEY) !== null, true)
  const loaded = loadSettings(storage)
  assert.equal(loaded.intervalMs, 5000)
  assert.equal(loaded.mirror, false)
})

test('loadSettings falls back to defaults for missing or malformed storage', () => {
  const storage = new MemoryStorage()
  assert.deepEqual(loadSettings(storage), defaultSettings())
  storage.setItem(SETTINGS_KEY, '{not json')
  assert.deepEqual(loadSettings(storage), defaultSettings())
  storage.setItem(SETTINGS_KEY, 'null')
  assert.deepEqual(loadSettings(storage), defaultSettings())
})

test('parseCustomSites accepts a valid array and rejects bad entries atomically', () => {
  const valid = parseCustomSites(
    JSON.stringify([
      { id: 'lobe', label: 'Lobe', url: 'https://chat.example.com/', hosts: ['chat.example.com'] },
      { id: 'plain', label: 'Plain', url: 'https://plain.example.com/chat' },
    ]),
  )
  assert.equal(valid.error, undefined)
  assert.equal(valid.sites.length, 2)
  assert.equal(valid.sites[0]?.id, 'lobe')

  assert.equal(parseCustomSites('').sites.length, 0)
  assert.equal(parseCustomSites('not json').error !== undefined, true)
  assert.equal(parseCustomSites('{}').error !== undefined, true)
  assert.equal(parseCustomSites(JSON.stringify([{ id: 'a', label: 'A' }])).error !== undefined, true)
  assert.equal(
    parseCustomSites(JSON.stringify([
      { id: 'a', label: 'A', url: 'https://a.example.com' },
      { id: 'a', label: 'B', url: 'https://b.example.com' },
    ])).error !== undefined,
    true,
  )
})

test('console state persists and clamps to the current viewport', () => {
  const storage = new MemoryStorage()
  assert.deepEqual(loadConsoleState(storage, { width: 1440, height: 900 }).bounds, {
    x: 1064,
    y: 364,
    width: 360,
    height: 520,
  })
  saveConsoleState(storage, {
    bounds: { x: 10, y: 20, width: 360, height: 520 },
    collapsed: false,
    hidden: true,
  })
  const loaded = loadConsoleState(storage, { width: 800, height: 600 })
  assert.equal(loaded.hidden, true)
  assert.equal(loaded.collapsed, false)
  assert.ok(loaded.bounds.x >= 16)
  assert.ok(loaded.bounds.y >= 16)
  assert.ok(storage.getItem(CONSOLE_KEY) !== null)
})

test('clearPluginStorage removes both keys', () => {
  const storage = new MemoryStorage()
  saveSettings(storage, defaultSettings())
  saveConsoleState(storage, { bounds: { x: 0, y: 0, width: 360, height: 520 }, collapsed: false, hidden: false })
  clearPluginStorage(storage)
  assert.equal(storage.getItem(SETTINGS_KEY), null)
  assert.equal(storage.getItem(CONSOLE_KEY), null)
})
